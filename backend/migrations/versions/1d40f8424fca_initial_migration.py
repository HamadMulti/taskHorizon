"""Initial migration

Revision ID: 1d40f8424fca
Revises: 7c4f823f32cd
Create Date: 2025-02-18 05:00:16.015053

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d40f8424fca'
down_revision = '7c4f823f32cd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('verified')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('verified', sa.BOOLEAN(), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
