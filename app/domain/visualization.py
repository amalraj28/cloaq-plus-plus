from pathlib import Path
import tempfile
from app.core.utils import generate_unique_string

import matplotlib
matplotlib.use('agg')
from matplotlib.figure import Figure
from qiskit.visualization import circuit_drawer

from app.domain.qcircuit import QCircuit


def get_temp_folder_path():
    path = Path(tempfile.gettempdir()) / "cloaq"
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_to_temp(img: Figure, filename: str):
    fp = get_temp_folder_path() / filename
    img.savefig(fp, dpi=150, format="png", bbox_inches="tight", pad_inches=0.0)
    
    return f"/image/{filename}"


def get_image_url(qc: QCircuit):
    unique_name = generate_unique_string()
    filename = f"circuit_{unique_name}.png"
    fig = circuit_drawer(qc.qc, output="mpl")
    
    return save_to_temp(fig, filename) # type: ignore
