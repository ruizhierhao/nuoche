addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const phone = '15357616269'
  const wxpusherAppToken = 'AT_1h9cZ0B3dLKmWdnxPywoNsoPQkoHGRAS'
  const wxpusherUIDs = ["UID_Vgatjp7MNWDyRt0sBQtYiomlza3M", "UID_JS0mIXkUOlZp8xJzDHsZ4sJ8NpmS"]

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>通知车主挪车</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --primary-color: #4776E6;
            --secondary-color: #8E54E9;
            --text-color: #2c3e50;
            --shadow-color: rgba(0, 0, 0, 0.1);
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--text-color);
            padding: 20px;
            line-height: 1.6;
          }
          .container { 
            text-align: center; 
            padding: 40px 30px; 
            width: 100%; 
            max-width: 450px; 
            border-radius: 24px; 
            box-shadow: 0 10px 40px var(--shadow-color);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            transform: translateY(0);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .container:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
          }
          h1 { 
            font-size: 32px; 
            margin-bottom: 25px; 
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
          }
          .car-icon {
            font-size: 64px;
            margin-bottom: 25px;
            display: inline-block;
            animation: float 6s ease-in-out infinite;
          }
          p { 
            margin-bottom: 30px; 
            font-size: 18px; 
            color: #546e7a;
            line-height: 1.8;
          }
          .button-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          button { 
            width: 100%; 
            padding: 16px 24px; 
            font-size: 18px; 
            font-weight: 600; 
            color: #fff; 
            border: none; 
            border-radius: 16px; 
            cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          button:active {
            transform: scale(0.98);
          }
          .notify-btn { 
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            box-shadow: 0 4px 15px rgba(71, 118, 230, 0.2);
          }
          .notify-btn:hover { 
            box-shadow: 0 6px 20px rgba(71, 118, 230, 0.3);
            transform: translateY(-2px);
          }
          .call-btn { 
            background: linear-gradient(45deg, #00b09b, #96c93d);
            box-shadow: 0 4px 15px rgba(0, 176, 155, 0.2);
          }
          .call-btn:hover { 
            box-shadow: 0 6px 20px rgba(0, 176, 155, 0.3);
            transform: translateY(-2px);
          }
          @keyframes float {
            0% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
            100% {
              transform: translateY(0px) rotate(0deg);
            }
          }
          .loading {
            position: relative;
            pointer-events: none;
          }
          .loading::after {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            border: 3px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
            margin-left: 10px;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.3s;
          }
          .toast.show {
            opacity: 1;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="car-icon">🚗</div>
          <h1>温馨提示</h1>
          <p>不好意思阻碍到您的出行了<br>请通过以下方式联系我，我会立即前来挪车</p>
          <div class="button-group">
            <button class="notify-btn" onclick="notifyOwner()">
              <span>微信通知</span> 📱
            </button>
            <button class="call-btn" onclick="callOwner()">
              <span>电话联系</span> 📞
            </button>
          </div>
        </div>
        <div id="toast" class="toast"></div>

        <script>
          function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
              toast.classList.remove('show');
            }, duration);
          }

          function notifyOwner() {
            const button = document.querySelector('.notify-btn');
            button.classList.add('loading');
            button.disabled = true;

            fetch("https://wxpusher.zjiecode.com/api/send/message", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                appToken: "${wxpusherAppToken}",
                content: "您好，有人需要您挪车，请及时处理。",
                contentType: 1,
                uids: ${JSON.stringify(wxpusherUIDs)}
              })
            })
            .then(response => response.json())
            .then(data => {
              button.classList.remove('loading');
              button.disabled = false;
              if (data.code === 1000) {
                showToast("通知已发送，车主很快就来！");
              } else {
                showToast("发送失败，请尝试电话联系");
              }
            })
            .catch(error => {
              console.error("Error:", error);
              button.classList.remove('loading');
              button.disabled = false;
              showToast("网络错误，请尝试电话联系");
            });
          }

          function callOwner() {
            window.location.href = "tel:${phone}";
          }
        </script>
      </body>
    </html>
  `

  return new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  })
}