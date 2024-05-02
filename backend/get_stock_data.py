from flask import Flask, request, jsonify
import yfinance as yf

app = Flask(__name__)

@app.route('/get-stock-data', methods=['POST'])
def get_stock_data():
    data = request.get_json()
    stock_symbol = data['stockName']

    stock = yf.Ticker(stock_symbol)
    hist = stock.history(interval='1d', period='1mo', auto_adjust=False)
    last_close = hist['Close'].iloc[-2]
    latest_close = hist['Close'].iloc[-1]

    return jsonify(last_close=last_close.item(), latest_close=latest_close.item())

if __name__ == '__main__':
    app.run(port=5500)