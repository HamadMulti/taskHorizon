from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, decode_token

bcrypt = Bcrypt()


def hash_password(password):
    """Hashes a given password.

    This function uses bcrypt to generate a secure hash of the provided password.

    Args:
        password (str): The password to hash.

    Returns:
        str: The hashed password.
    """
    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(hashed_password, password):
    """Verifies a password against a hash.

    This function checks if a given password matches a stored hashed password.

    Args:
        hashed_password (str): The hashed password.
        password (str): The password to verify.

    Returns:
        bool: True if the password matches the hash, False otherwise.
    """
    return bcrypt.check_password_hash(hashed_password, password)


def generate_token(user_id):
    """Generates an access token for a user.

    This function creates a JWT access token using the provided user ID.

    Args:
        user_id (int): The ID of the user.

    Returns:
        str: The generated access token.
    """
    return create_access_token(identity=user_id)


def decoded_token(token):
    """Decodes a JWT token.

    This function decodes a given JWT token and returns the user ID.

    Args:
        token (str): The JWT token to decode.

    Returns:
        int: The user ID extracted from the token.

    Raises:
        Exception: If the token is invalid.
    """
    try:
        decoded = decode_token(token)
        return decoded['identity']
    except Exception as e:
# sourcery skip: raise-specific-error
        raise Exception(f"Invalid token: {str(e)}") from e
