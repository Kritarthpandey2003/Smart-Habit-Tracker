import sys
import os

with open('syntax_log.txt', 'w') as f:
    sys.path.append(os.path.join(os.getcwd(), 'api'))
    f.write(f"Path: {sys.path}\n")

    try:
        f.write("Importing mock_store...\n")
        import mock_store
        f.write("mock_store ok\n")

        f.write("Importing routes.auth...\n")
        from routes import auth
        f.write("auth ok\n")

        f.write("Importing routes.habits...\n")
        from routes import habits
        f.write("habits ok\n")

        f.write("Importing routes.coach...\n")
        from routes import coach
        f.write("coach ok\n")

        f.write("Importing index...\n")
        import index
        f.write("index ok\n")

    except Exception as e:
        import traceback
        traceback.print_exc(file=f)
