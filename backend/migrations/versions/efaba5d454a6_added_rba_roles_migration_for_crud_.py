"""added RBA roles migration for CRUD functionalies

Revision ID: efaba5d454a6
Revises: d523ff4c76f1
Create Date: 2025-03-18 11:56:21.812617

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'efaba5d454a6'
down_revision = 'd523ff4c76f1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('archived_task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('due_date', sa.Date(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('archived_task', schema=None) as batch_op:
        batch_op.drop_column('due_date')

    # ### end Alembic commands ###
