"""create datasets table

Revision ID: a1b2c3d4e5f6
Revises: dd6dcecc7fc9

Create Date: 2026-08-27 14:00:00.000000
"""
# IMPORTS
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# MIGRATION IDENTIFIERS
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "dd6dcecc7fc9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# CREATE DATASETS TABLE
def upgrade() -> None:
    op.create_table(
        "datasets",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("original_filename", sa.String(), nullable=False),
        sa.Column("stored_path", sa.String(), nullable=False),
        sa.Column(
            "file_type",
            sa.Enum(
                "drone_imagery", "dsm", "dtm", "cadastral_scan",
                "gnss_csv", "vector", "unspecified",
                name="dataset_type",
            ),
            nullable=False,
        ),
        sa.Column("file_size_bytes", sa.BigInteger(), nullable=False),
        sa.Column("mime_type", sa.String(), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False),
        sa.Column("crs", sa.String(), nullable=True),
        sa.Column("bbox_minx", sa.Float(), nullable=True),
        sa.Column("bbox_miny", sa.Float(), nullable=True),
        sa.Column("bbox_maxx", sa.Float(), nullable=True),
        sa.Column("bbox_maxy", sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

# REMOVE DATASETS TABLE
def downgrade() -> None:
    op.drop_table("datasets")
    op.execute("DROP TYPE IF EXISTS dataset_type")
