# main.py
from fastapi import FastAPI, Request
import json
import uvicorn

app = FastAPI()

@app.post('/')
@app.post('/test')
async def handle_post(request: Request):
    _func = 'main.handle_post'
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        body_json = json.loads(body_str) if body_str else {}
        
        # 印 headers
        print(f"[POST /test] Headers:")
        for k, v in request.headers.items():
            print(f"  {k}: {v}")
        
        print(f"[POST /test] Body:\n{json.dumps(body_json, indent=2, ensure_ascii=False)}")
        return {"status": 200}
    except Exception as e:
        print(f"[ERROR] - {_func}: {e}")
        return {"status": 400}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=9000)