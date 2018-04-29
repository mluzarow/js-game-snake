/**
 * Pre-game setup class for setting up game variables according to user preference.
 */
class Setup {
	/**
	 * Constructor for class Setup.
	 */
	constructor () {
		this.$setupWrap = document.getElementById ("setup-wrap");
		
		this.$inputWidth = document.getElementsByClassName("board-width")[0];
		this.$inputHeight = document.getElementsByClassName("board-height")[0];
		
		this.$wrapWidth = this.$inputWidth.parentNode;
		this.$wrapHeight = this.$inputHeight.parentNode;
		
		this.$startBtn = document.getElementById("setup-start_btn");
		
		this.$inputWidth.value = "30";
		this.$inputHeight.value = "15";
		
		this.inputValidation = new RegExp("^[0-9]+$");
		
		this.$startBtn.addEventListener("click", this.startButtonClick.bind (this));
	}
	
	/**
	 * Game start button click event.
	 */
	startButtonClick () {
		this.$wrapWidth.classList.remove ("error");
		this.$wrapHeight.classList.remove ("error");
		
		var flagWidth = this.inputValidation.test(this.$inputWidth.value);
		var flagHeight = this.inputValidation.test(this.$inputHeight.value);
		
		if ((flagWidth && flagHeight) === false) {
			if (flagWidth === false) {
				this.$wrapWidth.classList.add ("error");
			}
			
			if (flagHeight === false) {
				this.$wrapHeight.classList.add ("error");
			}
		} else {
			this.loadGame ();
		}
	}
	
	/**
	 * Hands off control to the game controller.
	 */
	loadGame () {
		this.$setupWrap.style.display = "none";
		
		new Snake (
			parseInt (this.$inputWidth.value),
			parseInt (this.$inputHeight.value)
		);
	}
}
