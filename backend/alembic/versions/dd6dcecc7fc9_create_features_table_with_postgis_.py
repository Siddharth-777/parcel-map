"""create features table with PostGIS geometry

Revision ID: dd6dcecc7fc9
Revises:
Create Date: 2026-08-24 15:57:06.232045

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2

revision: str = 'dd6dcecc7fc9'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('features',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('type', sa.Enum('parcel', 'building', 'road', 'landuse', name='feature_type'), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('source_image', sa.String(), nullable=False),
        sa.Column('coordinate_space', sa.Enum('pixel', 'geo', name='coordinate_space'), nullable=False),
        sa.Column('geometry', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('features')
    op.execute("DROP TYPE IF EXISTS feature_type")
    op.execute("DROP TYPE IF EXISTS coordinate_space")
