import time
import threading
from typing import Optional, Dict, Any

class GenerationProgressTracker:
    def __init__(self):
        self.lock = threading.Lock()
        self.is_generating = False
        self.percentage = 0
        self.current_step = 0
        self.total_steps = 25
        self.task_id = ""
        self.start_time = 0.0

    def start(self, task_id: str = "", total_steps: int = 25, project_id: str = ""):
        with self.lock:
            self.is_generating = True
            self.percentage = 2
            self.current_step = 0
            self.total_steps = max(1, total_steps)
            self.task_id = task_id
            self.project_id = project_id
            self.start_time = time.time()

    def update_step(self, step: int, total_steps: Optional[int] = None, min_pct: int = 5, max_pct: int = 92):
        with self.lock:
            if total_steps is not None and total_steps > 0:
                self.total_steps = total_steps
            self.current_step = step + 1
            span = max_pct - min_pct
            pct = int(min_pct + ((step + 1) / self.total_steps) * span)
            self.percentage = min(max_pct, max(min_pct, pct))

    def set_percentage(self, pct: int):
        with self.lock:
            self.percentage = max(0, min(100, pct))

    def set_decoding(self):
        with self.lock:
            self.percentage = max(self.percentage, 95)

    def set_finalizing(self):
        with self.lock:
            self.percentage = max(self.percentage, 98)

    def finish(self):
        with self.lock:
            self.is_generating = False
            self.percentage = 100
            self.current_step = self.total_steps

    def reset(self):
        with self.lock:
            self.is_generating = False
            self.percentage = 0
            self.current_step = 0

    def cancel(self):
        with self.lock:
            self.is_generating = False
            self.percentage = 0
            self.current_step = 0
            self.task_id = ""

    def get_status(self) -> Dict[str, Any]:
        with self.lock:
            return {
                "is_generating": self.is_generating,
                "percentage": self.percentage,
                "current_step": self.current_step,
                "total_steps": self.total_steps,
                "task_id": self.task_id,
                "project_id": getattr(self, "project_id", "")
            }

progress_tracker = GenerationProgressTracker()
