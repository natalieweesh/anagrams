class AnagramGame {
    constructor() {
        this.words = window.words;
        this.currentWord = null;
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = false;
        this.timer = null;
        
        // Scrabble letter point values
        this.scrabblePoints = {
            'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1, 'L': 1, 'N': 1, 'S': 1, 'T': 1, 'R': 1,
            'D': 2, 'G': 2,
            'B': 3, 'C': 3, 'M': 3, 'P': 3,
            'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
            'K': 5,
            'J': 8, 'X': 8,
            'Q': 10, 'Z': 10
        };
        
        // DOM elements
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.scrambledWordElement = document.getElementById('scrambledWord');
        this.clueElement = document.getElementById('clue');
        this.guessInput = document.getElementById('guessInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.feedbackElement = document.getElementById('feedback');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        this.scoreMessageElement = document.getElementById('scoreMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startGame();
    }
    
    bindEvents() {
        // Submit button click
        this.submitBtn.addEventListener('click', () => this.submitGuess());
        
        // Enter key press
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitGuess();
            }
        });
        
        // Play again button
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        // Input validation - only allow letters
        this.guessInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.timeLeft = 60;
        this.updateScore();
        this.updateTimer();
        this.loadNewWord();
        this.startTimer();
        this.guessInput.focus();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
        
        // Change color when time is running low
        if (this.timeLeft <= 10) {
            this.timerElement.style.color = '#e53e3e';
            this.timerElement.style.fontWeight = 'bold';
        } else {
            this.timerElement.style.color = '#e53e3e';
            this.timerElement.style.fontWeight = 'normal';
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    loadNewWord() {
        // Get a random word
        const randomIndex = Math.floor(Math.random() * this.words.length);
        this.currentWord = this.words[randomIndex];
        
        // Display scrambled word and clue
        const scrambledWord = this.scrambleWord(this.currentWord.word);
        this.displayScrabbleTiles(scrambledWord);
        this.clueElement.textContent = this.currentWord.clue;
        
        // Update input maxlength to match word length
        this.guessInput.maxLength = this.currentWord.word.length;
        
        // Clear input and feedback
        this.guessInput.value = '';
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
        
        // Remove any shake animation
        this.guessInput.classList.remove('shake');
    }
    
    scrambleWord(word) {
        const letters = word.split('');
        let scrambled;
        
        // Keep scrambling until we get a different arrangement
        do {
            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [letters[i], letters[j]] = [letters[j], letters[i]];
            }
            scrambled = letters.join('');
        } while (scrambled === word && word.length > 1);
        
        return scrambled.toUpperCase();
    }
    
    displayScrabbleTiles(scrambledWord) {
        // Clear the container
        this.scrambledWordElement.innerHTML = '';
        
        // Create individual tiles for each letter
        for (let letter of scrambledWord) {
            const tile = document.createElement('div');
            tile.className = 'scrabble-tile';
            tile.textContent = letter;
            tile.setAttribute('data-points', this.scrabblePoints[letter] || 0);
            this.scrambledWordElement.appendChild(tile);
        }
    }
    
    submitGuess() {
        if (!this.gameActive) return;
        
        const guess = this.guessInput.value.trim().toLowerCase();
        
        if (guess.length === 0) {
            this.showFeedback('Please enter a guess!', 'incorrect');
            return;
        }
        
        const expectedLength = this.currentWord.word.length;
        if (guess.length !== expectedLength) {
            this.showFeedback(`Word must be ${expectedLength} letters!`, 'incorrect');
            this.shakeInput();
            return;
        }
        
        if (guess === this.currentWord.word.toLowerCase()) {
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess();
        }
    }
    
    handleCorrectGuess() {
        this.score++;
        this.updateScore();
        this.showFeedback('Correct! 🎉', 'correct');
        
        // Load new word after a short delay
        setTimeout(() => {
            this.loadNewWord();
            this.guessInput.focus();
        }, 1000);
    }
    
    handleIncorrectGuess() {
        this.showFeedback('Try again!', 'incorrect');
        this.shakeInput();
        
        // Clear input for next attempt
        setTimeout(() => {
            this.guessInput.value = '';
            this.guessInput.focus();
        }, 500);
    }
    
    showFeedback(message, type) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = `feedback ${type}`;
    }
    
    shakeInput() {
        this.guessInput.classList.add('shake');
        setTimeout(() => {
            this.guessInput.classList.remove('shake');
        }, 500);
    }
    
    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        // Disable input
        this.guessInput.disabled = true;
        this.submitBtn.disabled = true;
        
        // Show game over screen
        this.finalScoreElement.textContent = this.score;
        this.scoreMessageElement.textContent = this.getScoreMessage(this.score);
        this.gameOverScreen.style.display = 'flex';
    }
    
    getScoreMessage(score) {
        if (score >= 20) {
            return "🏆 Incredible! You're an anagram master!";
        } else if (score >= 15) {
            return "🌟 Excellent work! You're really good at this!";
        } else if (score >= 10) {
            return "🎯 Great job! You've got solid anagram skills!";
        } else if (score >= 5) {
            return "👍 Good effort! Keep practicing!";
        } else {
            return "💪 Don't give up! Try again to improve!";
        }
    }
    
    resetGame() {
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Hide game over screen
        this.gameOverScreen.style.display = 'none';
        
        // Re-enable input
        this.guessInput.disabled = false;
        this.submitBtn.disabled = false;
        
        // Reset game state
        this.startGame();
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, words array length:', window.words.length);
        new AnagramGame();
    } catch (error) {
        console.error('Error starting game:', error);
        document.getElementById('scrambledWord').textContent = 'ERROR: ' + error.message;
        document.getElementById('clue').textContent = 'Check browser console for details';
    }
});
