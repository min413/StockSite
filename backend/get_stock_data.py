from flask import Flask, request, jsonify
import yfinance as yf

app = Flask(__name__)

@app.route('/get-stock-data', methods=['POST'])
def get_stock_data():
    data = request.get_json()
    stock_symbol = data['stockName']

    try:
        stock = yf.Ticker(stock_symbol)
        hist = stock.history(interval='1d', period='1mo', auto_adjust=False)

        if hist.empty:
            return jsonify({'error': 'No historical data available'}), 404

        last_close = hist['Close'].iloc[-2]
        latest_close = hist['Close'].iloc[-1]
        
        dividends = stock.dividends.tail(1)
        latest_div = "N/A"
        latest_div_date = "N/A"
        
        for date in dividends.index:
            latest_div = date.strftime("%Y년 %m월 %d일").replace(" 0", " ")
            latest_div_date = dividends[date]
            
        return jsonify(
            last_close=last_close.item(), 
            latest_close=latest_close.item(), 
            latest_div=latest_div, 
            latest_div_date=latest_div_date
        )
    
    except Exception as e:
        print(f"Error fetching stock data for {stock_symbol}: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5500, debug=True)
