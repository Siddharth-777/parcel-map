# IMPORTS
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.core.database import Base
from app.models.feature import Feature  # noqa: F401
from app.models.dataset import Dataset  # noqa: F401

# ALEMBIC CONFIGURATION
config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# POSTGIS SYSTEM TABLES TO EXCLUDE
EXCLUDE_TABLES = {
    "spatial_ref_sys", "topology", "layer",
    "faces", "edges", "addr", "addrfeat", "bg", "county", "cousub",
    "featnames", "place", "state", "tabblock", "tabblock20", "tract",
    "zcta5", "county_lookup", "countysub_lookup", "direction_lookup",
    "geocode_settings", "geocode_settings_default", "loader_lookuptables",
    "loader_platform", "loader_variables", "pagc_gaz", "pagc_lex",
    "pagc_rules", "place_lookup", "secondary_unit_lookup", "state_lookup",
    "street_type_lookup", "zip_lookup", "zip_lookup_all", "zip_lookup_base",
    "zip_state", "zip_state_loc",
}

# FILTER POSTGIS SYSTEM TABLES
def include_object(object, name, type_, reflected, compare_to):
    if type_ == "table" and name in EXCLUDE_TABLES:
        return False
    return True

# RUN OFFLINE MIGRATIONS
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()

# RUN ONLINE MIGRATIONS
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=include_object,
        )

        with context.begin_transaction():
            context.run_migrations()

# SELECT MIGRATION MODE
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()