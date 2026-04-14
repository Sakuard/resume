import os
import logging
from logging.handlers import RotatingFileHandler
import argparse
from pydantic_settings import BaseSettings
from pydantic import ValidationError, Field

# Global logger
logger = logging.getLogger(__name__)


# Define a Pydantic Settings class to load environment variables
class Settings(BaseSettings):
    LOGLEVEL: str = Field(default="INFO", env="LOGLEVEL")
    ACTIVATECODE: str | None = Field(env="ACTIVATECODE")

    class Config:
        env_file = ".env"  # Optional, allows loading from a .env file


# Configure logging
def setup_logging(loglevel: str):
    log_level = getattr(logging, loglevel.upper(), logging.INFO)
    logger.setLevel(log_level)

    # Define a unified log format
    log_format = "%(asctime)s - %(filename)s - %(levelname)s - %(message)s"

    # Configure RotatingFileHandler
    file_handler = RotatingFileHandler(
        "./question2.log", maxBytes=1 * 1024, backupCount=2
    )
    file_formatter = logging.Formatter(log_format)
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # Configure StreamHandler (stdout)
    stream_handler = logging.StreamHandler()
    stream_formatter = logging.Formatter(log_format)
    stream_handler.setFormatter(stream_formatter)
    logger.addHandler(stream_handler)

    # Set the root logger's log level
    logging.basicConfig(level=log_level)


# Main function
def main():
    try:
        # Initialize settings
        settings = Settings()
    except ValidationError as e:
        logger.error("Failed to validate environment variables: %s", e)
        return

    # Set up logging
    setup_logging(settings.LOGLEVEL)

    # Validate ACTIVATECODE
    if settings.ACTIVATECODE != "password":
        logger.error("ACTIVATECODE validation failed!")
        raise ValueError("ACTIVATECODE must be 'password'")

    # Set up argparse to handle CLI arguments
    parser = argparse.ArgumentParser(description="SRE Interview CLI")
    parser.add_argument("--answer2", type=str, help="The first parameter")

    args = parser.parse_args()

    # Log all arguments
    logger.debug("Received arguments: %s", args)

    # Simulate further execution
    logger.info("CLI executed successfully!")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.exception("An error occurred during program execution:")