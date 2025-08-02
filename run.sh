WEB_DIR=`pwd`
SERVER_DIR="server"
WEB_PORT=5000
SERVER_REPO="git@github.com:dmaharana/todo_app_react_py_server.git"
# 1. Clone server and build Userinterface
git clone ${SERVER_REPO} ../${SERVER_DIR} && \
pnpm install && \
pnpm build && \
cp -r dist ../${SERVER_DIR}

# 2. Run server
cd ${SERVER_DIR} && \
pip install -r requirements.txt && \
python api.py --port 5000 --build-dir dist
