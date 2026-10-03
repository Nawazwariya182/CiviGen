import React, { useState, useEffect } from 'react';
import {
  Code,
  Send,
  Copy,
  Check,
  Zap,
  Terminal,
  FileText,
  Sliders,
  Sparkles,
  ExternalLink,
  Layers,
  Cpu
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { ShinyText } from './ShinyText';

interface TaskMeta {
  id: string;
  category: string;
  title: string;
  description: string;
  example_prompt: string;
  default_model: string;
  default_width: number;
  default_height: number;
  default_steps: number;
  default_cfg: number;
  default_denoise: number;
  default_sampler: string;
  default_scheduler: string;
  tiled_vae: boolean;
  requires_image: boolean;
  system_prompt_template: string;
}

export const ApiPlaygroundTab: React.FC = () => {
  const [tasks, setTasks] = useState<Record<string, TaskMeta>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string>('arch_text_to_arch');
  const [apiStyle, setApiStyle] = useState<'openai_chat' | 'openai_image' | 'task_native'>('openai_chat');
  const [baseUrl, setBaseUrl] = useState<string>('http://127.0.0.1:8000');
  const [apiKey, setApiKey] = useState<string>('sk-antigravity-local');

  // Request State
  const [requestJson, setRequestJson] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Response State
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [responseImageUrl, setResponseImageUrl] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'python_openai' | 'python_requests' | 'js_fetch'>('curl');

  // Fetch tasks on mount
  useEffect(() => {
    fetch('/api/v1/tasks')
      .then(res => res.json())
      .then(data => {
        if (data && data.tasks) {
          setTasks(data.tasks);
        }
      })
      .catch(err => console.error('Failed to load tasks:', err));
  }, []);

  // Update request template when task or API style changes
  useEffect(() => {
    const task = tasks[selectedTaskId];
    if (!task) return;

    if (apiStyle === 'openai_chat') {
      const payload = {
        model: task.default_model === 'flux' ? 'flux-2-klein' : 'qwen-image-2.1',
        task: task.id,
        messages: [
          {
            role: 'system',
            content: 'You are an elite architectural visualization and interior design AI agent.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: task.example_prompt
              }
            ]
          }
        ],
        width: task.default_width,
        height: task.default_height,
        steps: task.default_steps,
        cfg: task.default_cfg,
        temperature: 0.7
      };
      if (task.requires_image) {
        (payload.messages[1].content as any).push({
          type: 'image_url',
          image_url: {
            url: 'data:image/jpeg;base64,...(base64_sketch_or_room_image)...'
          }
        });
      }
      setRequestJson(JSON.stringify(payload, null, 2));
    } else if (apiStyle === 'openai_image') {
      const payload = {
        model: task.default_model === 'flux' ? 'flux-2-klein' : 'qwen-image-2.1',
        prompt: task.example_prompt,
        n: 1,
        size: `${task.default_width}x${task.default_height}`,
        response_format: 'b64_json'
      };
      setRequestJson(JSON.stringify(payload, null, 2));
    } else {
      // Task Native API
      const payload = {
        task_id: task.id,
        prompt: task.example_prompt,
        style: 'Modern Luxury Villa',
        lighting: 'Twilight Golden Hour',
        model: task.default_model,
        width: task.default_width,
        height: task.default_height,
        steps: task.default_steps,
        cfg: task.default_cfg,
        denoise: task.default_denoise,
        seed: -1,
        enhance_prompt: false,
        upscale_4k: false,
        images_base64: task.requires_image ? ['data:image/jpeg;base64,...'] : []
      };
      setRequestJson(JSON.stringify(payload, null, 2));
    }
  }, [selectedTaskId, apiStyle, tasks]);

  const currentTask = tasks[selectedTaskId];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getEndpointPath = () => {
    if (apiStyle === 'openai_chat') return '/v1/chat/completions';
    if (apiStyle === 'openai_image') return '/v1/images/generations';
    return '/api/v1/tasks/generate';
  };

  const handleSendRequest = async () => {
    setIsSending(true);
    setResponseStatus(null);
    setResponseTimeMs(null);
    setResponseJson(null);
    setResponseImageUrl(null);

    const t0 = performance.now();
    try {
      const endpoint = getEndpointPath();
      const parsedBody = JSON.parse(requestJson);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(parsedBody)
      });

      const dur = Math.round(performance.now() - t0);
      setResponseStatus(res.status);
      setResponseTimeMs(dur);

      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));

      // Extract image URL or base64
      if (data.file_url) {
        setResponseImageUrl(data.file_url);
      } else if (data.image_base64) {
        setResponseImageUrl(data.image_base64);
      } else if (data.choices?.[0]?.message?.image_url) {
        setResponseImageUrl(data.choices[0].message.image_url);
      } else if (data.choices?.[0]?.message?.image_base64) {
        setResponseImageUrl(data.choices[0].message.image_base64);
      } else if (data.data?.[0]?.b64_json) {
        setResponseImageUrl(`data:image/png;base64,${data.data[0].b64_json}`);
      } else if (data.data?.[0]?.url) {
        setResponseImageUrl(data.data[0].url);
      }
    } catch (err: any) {
      const dur = Math.round(performance.now() - t0);
      setResponseStatus(500);
      setResponseTimeMs(dur);
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsSending(false);
    }
  };

  // Generate code snippet
  const getCodeSnippet = () => {
    const endpoint = `${baseUrl}${getEndpointPath()}`;
    if (codeLanguage === 'curl') {
      return `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '${requestJson.replace(/'/g, "\\'")}'`;
    }
    if (codeLanguage === 'python_openai') {
      return `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}/v1",
    api_key="${apiKey}"
)

# Calling task: ${currentTask?.title || 'Architecture'}
response = client.chat.completions.create(
    model="${currentTask?.default_model === 'flux' ? 'flux-2-klein' : 'qwen-image-2.1'}",
    messages=[
        {"role": "user", "content": "${currentTask?.example_prompt || 'make a luxury villa'}"}
    ],
    extra_body={
        "task": "${selectedTaskId}",
        "width": ${currentTask?.default_width || 1024},
        "height": ${currentTask?.default_height || 1024}
    }
)

print("Generated render:", response.choices[0].message.content)`;
    }
    if (codeLanguage === 'python_requests') {
      return `import requests

url = "${endpoint}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
}
payload = ${requestJson}

response = requests.post(url, json=payload, headers=headers, timeout=300)
data = response.json()
print("Success:", data.get("success", True))
print("File URL:", data.get("file_url"))`;
    }
    if (codeLanguage === 'js_fetch') {
      return `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
  },
  body: JSON.stringify(${requestJson})
});

const data = await response.json();
console.log("Render result:", data);`;
    }
    return '';
  };

  return (
    <div className="api-page-container">
      {/* Top Banner */}
      <SpotlightCard className="api-card" spotlightColor="rgba(37, 99, 235, 0.08)">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge-pill" style={{ background: '#111827', color: '#FFFFFF', fontWeight: 600 }}>
                API Config & GPT-Style Calling
              </span>
              <ShinyText text="OpenAI SDK & REST v3.0 Compatible" className="badge-pill" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
              Architecture, Interior & Furniture API Console
            </h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
              Execute requests against local Qwen Image 2.1 & Flux.2 Klein engines using OpenAI SDK, cURL, or native JSON endpoints.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setApiStyle('openai_chat')}
              className="badge-pill"
              style={{
                cursor: 'pointer',
                background: apiStyle === 'openai_chat' ? '#111827' : '#FFFFFF',
                color: apiStyle === 'openai_chat' ? '#FFFFFF' : '#4B5563',
                padding: '6px 12px'
              }}
            >
              GPT Chat (/v1/chat/completions)
            </button>
            <button
              onClick={() => setApiStyle('openai_image')}
              className="badge-pill"
              style={{
                cursor: 'pointer',
                background: apiStyle === 'openai_image' ? '#111827' : '#FFFFFF',
                color: apiStyle === 'openai_image' ? '#FFFFFF' : '#4B5563',
                padding: '6px 12px'
              }}
            >
              OpenAI Image (/v1/images)
            </button>
            <button
              onClick={() => setApiStyle('task_native')}
              className="badge-pill"
              style={{
                cursor: 'pointer',
                background: apiStyle === 'task_native' ? '#111827' : '#FFFFFF',
                color: apiStyle === 'task_native' ? '#FFFFFF' : '#4B5563',
                padding: '6px 12px'
              }}
            >
              Native Task Endpoints
            </button>
          </div>
        </div>
      </SpotlightCard>

      {/* Task Selector & Best Configuration Card */}
      <div className="api-card">
        <div className="row-2col">
          <div className="form-group">
            <label className="form-label">Select Architecture / Interior Task</label>
            <select
              className="select-control"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <optgroup label="1. Architecture">
                <option value="arch_text_to_arch">Text to Arch (T2A)</option>
                <option value="arch_sketch_to_arch">Sketch to Image Arch Render (S2A)</option>
                <option value="arch_sketch_to_multiview">Sketch to Multi View 5-Elevations (S2MVA)</option>
                <option value="arch_image_edit">Architecture Image Editing (AIE)</option>
                <option value="arch_enhance_render">Enhance the Details of Render (ETDOTR)</option>
              </optgroup>
              <optgroup label="2. Interior Designing">
                <option value="interior_sketch_to_design">Sketch to Interior Design (S2ID)</option>
                <option value="interior_room_new_look">Give Your Room New Look (GYRNL)</option>
                <option value="interior_image_edit">Interior Design Image Editing (IDIE)</option>
                <option value="interior_fully_redesign">Fully Redesign My Room (FRMR)</option>
              </optgroup>
              <optgroup label="3. Furniture Rendering">
                <option value="furniture_sketch_to_render">Sketch to Furniture (S2F)</option>
                <option value="furniture_edit">Furniture Editing (FE)</option>
                <option value="furniture_text_to_render">Text-Furniture (T2F)</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">API Base URL</label>
            <input
              type="text"
              className="input-control"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Task Best Config Highlights */}
        {currentTask && (
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            <div>
              <span style={{ fontSize: 11, color: '#64748B', display: 'block' }}>Best Model</span>
              <strong style={{ fontSize: 13, color: '#0F172A' }}>{currentTask.default_model.toUpperCase()} DiT</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#64748B', display: 'block' }}>Recommended Size</span>
              <strong style={{ fontSize: 13, color: '#0F172A' }}>{currentTask.default_width} × {currentTask.default_height}</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#64748B', display: 'block' }}>Optimal Steps</span>
              <strong style={{ fontSize: 13, color: '#0F172A' }}>{currentTask.default_steps} steps</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#64748B', display: 'block' }}>Denoise / CFG</span>
              <strong style={{ fontSize: 13, color: '#0F172A' }}>{currentTask.default_denoise} / {currentTask.default_cfg}</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#64748B', display: 'block' }}>Input Type</span>
              <strong style={{ fontSize: 13, color: currentTask.requires_image ? '#2563EB' : '#059669' }}>
                {currentTask.requires_image ? 'Image + Prompt' : 'Text Prompt'}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column: Request Builder vs Response Preview */}
      <div className="api-grid-2col">
        {/* Left: Interactive Request Console */}
        <div className="api-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={16} /> Request Body (JSON)
            </span>
            <span className="badge-pill" style={{ fontFamily: 'var(--font-mono)' }}>
              POST {getEndpointPath()}
            </span>
          </div>

          <textarea
            value={requestJson}
            onChange={(e) => setRequestJson(e.target.value)}
            style={{
              width: '100%',
              height: 280,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              background: '#0F172A',
              color: '#F8FAFC',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical'
            }}
          />

          <button
            onClick={handleSendRequest}
            disabled={isSending}
            className="btn-primary"
            style={{ marginTop: 'auto' }}
          >
            {isSending ? (
              <>
                <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Executing Pipeline on RTX 5070...
              </>
            ) : (
              <>
                <Send size={15} /> Execute API Call
              </>
            )}
          </button>
        </div>

        {/* Right: Live Response & Image Preview */}
        <div className="api-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} /> Live Response
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {responseStatus && (
                <span
                  className="badge-pill"
                  style={{
                    background: responseStatus === 200 ? '#ECFDF5' : '#FEF2F2',
                    color: responseStatus === 200 ? '#059669' : '#DC2626',
                    fontWeight: 700
                  }}
                >
                  {responseStatus} {responseStatus === 200 ? 'OK' : 'Error'}
                </span>
              )}
              {responseTimeMs && (
                <span className="badge-pill">
                  {responseTimeMs} ms
                </span>
              )}
            </div>
          </div>

          {/* Rendered Output Image Preview if available */}
          {responseImageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: '100%', height: 200, borderRadius: 8, overflow: 'hidden', background: '#0F172A' }}>
                <img
                  src={responseImageUrl}
                  alt="API Output"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <a
                href={responseImageUrl}
                download="api_render.png"
                className="btn-secondary"
                style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
              >
                Download Rendered Asset
              </a>
            </div>
          ) : (
            <div style={{ width: '100%', height: 120, border: '1.5px dashed #E2E8F0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
              Click "Execute API Call" to generate asset
            </div>
          )}

          {/* JSON Response View */}
          <div className="code-block" style={{ maxHeight: 200, overflowY: 'auto' }}>
            <button
              className="copy-code-btn"
              onClick={() => handleCopy(responseJson || '', 'response_json')}
            >
              {copiedCode === 'response_json' ? <Check size={12} /> : <Copy size={12} />}
              {copiedCode === 'response_json' ? 'Copied' : 'Copy'}
            </button>
            <pre>{responseJson || '// Awaiting API response...'}</pre>
          </div>
        </div>
      </div>

      {/* Multi-Language Code Snippet Generator */}
      <div className="api-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Code size={16} /> Ready-to-Integrate Code Snippets
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['curl', 'python_openai', 'python_requests', 'js_fetch'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setCodeLanguage(lang)}
                className="badge-pill"
                style={{
                  cursor: 'pointer',
                  background: codeLanguage === lang ? '#111827' : '#FFFFFF',
                  color: codeLanguage === lang ? '#FFFFFF' : '#6B7280'
                }}
              >
                {lang === 'curl' ? 'cURL' : lang === 'python_openai' ? 'Python (OpenAI)' : lang === 'python_requests' ? 'Python (Requests)' : 'JavaScript (Fetch)'}
              </button>
            ))}
          </div>
        </div>

        <div className="code-block">
          <button
            className="copy-code-btn"
            onClick={() => handleCopy(getCodeSnippet(), 'code_snippet')}
          >
            {copiedCode === 'code_snippet' ? <Check size={12} /> : <Copy size={12} />}
            {copiedCode === 'code_snippet' ? 'Copied' : 'Copy Code'}
          </button>
          <pre>{getCodeSnippet()}</pre>
        </div>
      </div>
    </div>
  );
};
