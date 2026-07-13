from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    """Include catalog data from a checkout or from an extracted source archive."""

    def initialize(self, version: str, build_data: dict) -> None:
        source_archive_data = Path(self.root) / "data"
        checkout_data = Path(self.root).parent / "data"
        data_dir = source_archive_data if source_archive_data.exists() else checkout_data

        build_data["force_include"][str(data_dir)] = "aimodels/data"
