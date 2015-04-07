var num = Math.floor(Math.random() * 101);

function guessnum(){
	var guess = document.forms['form1'].num.value;

		if (guess == num)
	{
		alert("Great you Guessed! How did you know that?");
	}

		if (guess < num)
	{
		alert("No your number is too low!");
	}

		if (guess > num)
	{
		alert("No your number is too  high");
	}
}