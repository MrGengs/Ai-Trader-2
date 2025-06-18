        class AITradingSignals {
            constructor() {
                this.isRunning = false;
                this.interval = null;
                this.currentPrice = 42500; // Starting BTC price
                this.priceHistory = [];
                this.signalHistory = [];
                this.stats = {
                    total: 0,
                    bullish: 0,
                    bearish: 0,
                    accuracy: 0
                };
                
                this.indicators = {
                    rsi: 50,
                    macd: 0,
                    ema: 42500,
                    bollinger: 'Neutral',
                    volume: 'Normal',
                    volatility: 'Medium',
                    sentiment: 'Neutral',
                    priceChange24h: 0
                };

                this.cryptoData = {
                    symbol: 'BTCIDX',
                    name: 'Bitcoin Index',
                    lastUpdate: new Date()
                };

                this.initChart();
                this.bindEvents();
                this.generateInitialData();
            }

            initChart() {
                const ctx = document.getElementById('priceChart').getContext('2d');
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'BTC IDX Price ($)',
                            data: [],
                            borderColor: '#f7931a',
                            backgroundColor: 'rgba(247, 147, 26, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.2
                        }, {
                            label: 'Bullish Signals',
                            data: [],
                            backgroundColor: '#00c851',
                            borderColor: '#00c851',
                            pointRadius: 8,
                            pointHoverRadius: 10,
                            showLine: false,
                            pointStyle: 'triangle'
                        }, {
                            label: 'Bearish Signals',
                            data: [],
                            backgroundColor: '#ff4444',
                            borderColor: '#ff4444',
                            pointRadius: 8,
                            pointHoverRadius: 10,
                            showLine: false,
                            pointStyle: 'rectRot'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white'
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: 'white' },
                                grid: { color: 'rgba(255,255,255,0.1)' }
                            },
                            y: {
                                ticks: { color: 'white' },
                                grid: { color: 'rgba(255,255,255,0.1)' }
                            }
                        }
                    }
                });
            }

            bindEvents() {
                document.getElementById('startBtn').addEventListener('click', () => this.start());
                document.getElementById('stopBtn').addEventListener('click', () => this.stop());
                document.getElementById('resetBtn').addEventListener('click', () => this.reset());
            }

            generateInitialData() {
                // Generate 20 initial crypto price points
                for (let i = 0; i < 20; i++) {
                    const time = new Date(Date.now() - (20 - i) * 60000);
                    const priceVariation = (Math.random() - 0.5) * 5000;
                    this.priceHistory.push({
                        time: time,
                        price: this.currentPrice + priceVariation
                    });
                }
                this.updateChart();
                this.updateCryptoIndicatorsDisplay();
            }

            start() {
                this.isRunning = true;
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                
                this.addLogEntry('₿ Crypto AI Trading dimulai...', 'SYSTEM');
                
                this.interval = setInterval(() => {
                    this.generateSignal();
                }, 60000); // Every 1 minute
                
                // Generate first signal immediately
                setTimeout(() => this.generateSignal(), 2000);
            }

            stop() {
                this.isRunning = false;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
                
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                
                this.addLogEntry('⏹️ Trading dihentikan', 'SYSTEM');
                this.updateSignalDisplay('STOPPED', '📊', 0);
            }

            reset() {
                this.stop();
                this.stats = { total: 0, bullish: 0, bearish: 0, accuracy: 0 };
                this.signalHistory = [];
                this.priceHistory = [];
                this.currentPrice = 100;
                
                document.getElementById('signalHistory').innerHTML = '<div class="log-entry"><span>Sistem reset...</span><span style="opacity: 0.7;">--:--</span></div>';
                
                this.generateInitialData();
                this.updateStats();
                this.updateSignalDisplay('RESET', '🔄', 0);
            }

            generateSignal() {
                if (!this.isRunning) return;

                // Simulate crypto price movement (more volatile)
                const volatilityMultiplier = this.indicators.volatility === 'High' ? 2.5 : 
                                           this.indicators.volatility === 'Low' ? 0.5 : 1.5;
                const priceChange = (Math.random() - 0.5) * 2000 * volatilityMultiplier;
                this.currentPrice += priceChange;
                
                // Keep price in reasonable crypto range
                this.currentPrice = Math.max(20000, Math.min(100000, this.currentPrice));

                // Calculate 24h change
                if (this.priceHistory.length > 0) {
                    const oldPrice = this.priceHistory[Math.max(0, this.priceHistory.length - 24)]?.price || this.currentPrice;
                    this.indicators.priceChange24h = ((this.currentPrice - oldPrice) / oldPrice) * 100;
                }

                // Update price history
                this.priceHistory.push({
                    time: new Date(),
                    price: this.currentPrice
                });

                // Keep only last 50 points
                if (this.priceHistory.length > 50) {
                    this.priceHistory.shift();
                }

                // Generate crypto-specific indicators
                this.updateCryptoIndicators();

                // Enhanced AI Signal Logic for Crypto
                const signal = this.calculateCryptoSignal();
                
                this.stats.total++;
                if (signal.type === 'BULLISH') {
                    this.stats.bullish++;
                } else if (signal.type === 'BEARISH') {
                    this.stats.bearish++;
                }

                // Update accuracy (crypto-adjusted)
                this.stats.accuracy = Math.round(
                    (Math.random() * 15 + 75) // 75-90% simulated accuracy for crypto
                );

                this.signalHistory.push({
                    time: new Date(),
                    signal: signal.type,
                    confidence: signal.confidence,
                    price: this.currentPrice
                });

                this.updateSignalDisplay(signal.type, signal.icon, signal.confidence);
                this.addLogEntry(`${signal.icon} ${signal.type}`, signal.type, signal.confidence);
                this.updateStats();
                this.updateChart();
                this.updateCryptoIndicatorsDisplay();
            }

            calculateCryptoSignal() {
                const signals = [];
                let confidence = 60; // Base confidence for crypto

                // RSI Analysis (crypto-adjusted thresholds)
                if (this.indicators.rsi < 25) {
                    signals.push('BULLISH');
                    confidence += 20;
                } else if (this.indicators.rsi > 75) {
                    signals.push('BEARISH');
                    confidence += 20;
                } else if (this.indicators.rsi < 40) {
                    signals.push('BULLISH');
                    confidence += 10;
                } else if (this.indicators.rsi > 60) {
                    signals.push('BEARISH');
                    confidence += 10;
                }

                // MACD Analysis
                if (this.indicators.macd > 500) {
                    signals.push('BULLISH');
                    confidence += 15;
                } else if (this.indicators.macd < -500) {
                    signals.push('BEARISH');
                    confidence += 15;
                }

                // Price vs EMA
                const emaDiff = ((this.currentPrice - this.indicators.ema) / this.indicators.ema) * 100;
                if (emaDiff > 2) {
                    signals.push('BULLISH');
                    confidence += 12;
                } else if (emaDiff < -2) {
                    signals.push('BEARISH');
                    confidence += 12;
                }

                // Volume analysis
                if (this.indicators.volume === 'High') {
                    confidence += 8;
                }

                // Volatility factor
                if (this.indicators.volatility === 'High') {
                    confidence += 5; // High volatility can mean strong moves
                }

                // Market sentiment
                if (this.indicators.sentiment === 'Bullish') {
                    signals.push('BULLISH');
                    confidence += 10;
                } else if (this.indicators.sentiment === 'Bearish') {
                    signals.push('BEARISH');
                    confidence += 10;
                }

                // 24h price change momentum
                if (this.indicators.priceChange24h > 3) {
                    signals.push('BULLISH');
                    confidence += 8;
                } else if (this.indicators.priceChange24h < -3) {
                    signals.push('BEARISH');
                    confidence += 8;
                }

                // Determine final signal
                const bullishCount = signals.filter(s => s === 'BULLISH').length;
                const bearishCount = signals.filter(s => s === 'BEARISH').length;

                let finalSignal, icon;
                if (bullishCount > bearishCount) {
                    finalSignal = 'BULLISH';
                    icon = '🚀';
                } else if (bearishCount > bullishCount) {
                    finalSignal = 'BEARISH';
                    icon = '📉';
                } else {
                    finalSignal = 'NEUTRAL';
                    icon = '⚖️';
                    confidence = 55;
                }

                confidence = Math.min(95, Math.max(60, confidence));

                return {
                    type: finalSignal,
                    icon: icon,
                    confidence: confidence
                };
            }

            updateCryptoIndicators() {
                // Simulate crypto-specific technical indicators
                this.indicators.rsi = Math.max(0, Math.min(100, 
                    this.indicators.rsi + (Math.random() - 0.5) * 15
                ));
                
                this.indicators.macd = (Math.random() - 0.5) * 2000; // Larger range for crypto
                
                // EMA calculation
                if (this.priceHistory.length >= 20) {
                    const prices = this.priceHistory.slice(-20).map(item => item.price);
                    const multiplier = 2 / (20 + 1);
                    this.indicators.ema = prices.reduce((ema, price, index) => 
                        index === 0 ? price : (price * multiplier) + (ema * (1 - multiplier))
                    );
                } else {
                    this.indicators.ema = this.currentPrice;
                }
                
                // Bollinger analysis
                const emaDiff = ((this.currentPrice - this.indicators.ema) / this.indicators.ema) * 100;
                this.indicators.bollinger = emaDiff > 3 ? 'Upper' : 
                                          emaDiff < -3 ? 'Lower' : 'Middle';
                
                // Volume simulation (crypto markets are very volume-dependent)
                const volumeRand = Math.random();
                this.indicators.volume = volumeRand > 0.8 ? 'High' : 
                                       volumeRand < 0.2 ? 'Low' : 'Normal';
                
                // Volatility calculation
                if (this.priceHistory.length >= 10) {
                    const recentPrices = this.priceHistory.slice(-10);
                    const priceChanges = recentPrices.map((item, index) => 
                        index > 0 ? Math.abs(item.price - recentPrices[index-1].price) : 0
                    );
                    const avgChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
                    
                    if (avgChange > 1500) {
                        this.indicators.volatility = 'High';
                    } else if (avgChange < 500) {
                        this.indicators.volatility = 'Low';
                    } else {
                        this.indicators.volatility = 'Medium';
                    }
                }
                
                // Market sentiment (simulated based on price action and volume)
                const sentimentRand = Math.random();
                if (this.indicators.priceChange24h > 5 && this.indicators.volume === 'High') {
                    this.indicators.sentiment = 'Bullish';
                } else if (this.indicators.priceChange24h < -5 && this.indicators.volume === 'High') {
                    this.indicators.sentiment = 'Bearish';
                } else {
                    this.indicators.sentiment = sentimentRand > 0.6 ? 'Bullish' : 
                                              sentimentRand < 0.4 ? 'Bearish' : 'Neutral';
                }
            }

            updateCryptoIndicatorsDisplay() {
                document.getElementById('currentPrice').textContent = `${this.currentPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                
                const changeEl = document.getElementById('priceChange');
                const changeValue = this.indicators.priceChange24h;
                changeEl.textContent = `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}%`;
                changeEl.style.color = changeValue >= 0 ? '#00c851' : '#ff4444';
                
                document.getElementById('rsiValue').textContent = this.indicators.rsi.toFixed(1);
                document.getElementById('macdValue').textContent = this.indicators.macd.toFixed(0);
                document.getElementById('smaValue').textContent = `${this.indicators.ema.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                document.getElementById('bollingerValue').textContent = this.indicators.bollinger;
                document.getElementById('volumeValue').textContent = this.indicators.volume;
                document.getElementById('volatilityValue').textContent = this.indicators.volatility;
                
                const sentimentEl = document.getElementById('sentimentValue');
                sentimentEl.textContent = this.indicators.sentiment;
                sentimentEl.style.color = this.indicators.sentiment === 'Bullish' ? '#00c851' : 
                                         this.indicators.sentiment === 'Bearish' ? '#ff4444' : '#ffbb33';
            }

            updateSignalDisplay(type, icon, confidence) {
                const indicator = document.getElementById('signalIndicator');
                const text = document.getElementById('signalText');
                const confidenceEl = document.getElementById('signalConfidence');
                const lastUpdate = document.getElementById('lastUpdate');

                indicator.textContent = icon;
                text.textContent = type;
                confidenceEl.textContent = `Confidence: ${confidence}%`;
                lastUpdate.textContent = `Terakhir update: ${new Date().toLocaleTimeString('id-ID')}`;

                // Update indicator class
                indicator.className = 'signal-indicator';
                if (type === 'BULLISH') {
                    indicator.classList.add('signal-bullish');
                } else if (type === 'BEARISH') {
                    indicator.classList.add('signal-bearish');
                } else {
                    indicator.classList.add('signal-neutral');
                }
            }

            addLogEntry(message, type, confidence = null) {
                const history = document.getElementById('signalHistory');
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                
                const confidenceText = confidence ? ` (${confidence}%)` : '';
                const logClass = type === 'BULLISH' ? 'log-bullish' : 
                                type === 'BEARISH' ? 'log-bearish' : 
                                type === 'NEUTRAL' ? 'log-neutral' : '';
                
                entry.innerHTML = `
                    <span class="log-signal ${logClass}">${message}${confidenceText}</span>
                    <span style="opacity: 0.7;">${new Date().toLocaleTimeString('id-ID')}</span>
                `;
                
                history.insertBefore(entry, history.firstChild);
                
                // Keep only last 20 entries
                while (history.children.length > 20) {
                    history.removeChild(history.lastChild);
                }
            }

            updateStats() {
                document.getElementById('totalSignals').textContent = this.stats.total;
                document.getElementById('bullishCount').textContent = this.stats.bullish;
                document.getElementById('bearishCount').textContent = this.stats.bearish;
                document.getElementById('accuracy').textContent = `${this.stats.accuracy}%`;
            }

            updateChart() {
                const labels = this.priceHistory.map(item => 
                    item.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                );
                const prices = this.priceHistory.map(item => item.price);

                this.chart.data.labels = labels;
                this.chart.data.datasets[0].data = prices;

                // Add signal points
                const bullishPoints = [];
                const bearishPoints = [];

                this.signalHistory.forEach(signal => {
                    const index = this.priceHistory.findIndex(p => 
                        Math.abs(p.time - signal.time) < 30000 // Within 30 seconds
                    );
                    
                    if (index !== -1) {
                        if (signal.signal === 'BULLISH') {
                            bullishPoints[index] = signal.price;
                        } else if (signal.signal === 'BEARISH') {
                            bearishPoints[index] = signal.price;
                        }
                    }
                });

                this.chart.data.datasets[1].data = bullishPoints;
                this.chart.data.datasets[2].data = bearishPoints;

                this.chart.update('none');
            }
        }

        // Initialize the AI Trading System
        const aiTrading = new AITradingSignals();

        // Add some visual enhancements
        document.addEventListener('DOMContentLoaded', function() {
            // Add floating particles effect
            const createParticle = () => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: float 6s linear infinite;
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    z-index: -1;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 6000);
            };

            // Create particles periodically
            setInterval(createParticle, 2000);
        });

        // Add CSS for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                to {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);