"""initial

Revision ID: 91c91f9d9a79
Revises: 
Create Date: 2023-10-08 21:37:14.711072

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '91c91f9d9a79'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create the 'questions' table
    op.create_table(
        'questions_new',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('question_text', sa.String(length=255), nullable=True),
        sa.Column('answers', sa.String(), nullable=True),
        sa.Column('correct_answers', sa.String(), nullable=True),
        sa.Column('set_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['set_id'], ['sets_of_questions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create the 'sets_of_questions' table
    op.create_table(
        'sets_of_questions_new',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Copy data from old tables to new tables
    conn = op.get_bind()
    conn.execute("INSERT INTO questions_new SELECT * FROM questions")
    conn.execute("INSERT INTO sets_of_questions_new SELECT * FROM sets_of_questions")

    # Drop the old tables
    op.drop_table('questions')
    op.drop_table('sets_of_questions')

    # Rename the new tables to replace the old ones
    op.rename_table('questions_new', 'questions')
    op.rename_table('sets_of_questions_new', 'sets_of_questions')

def downgrade():
    raise NotImplementedError("Downgrade not supported for this migration")