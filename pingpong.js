const INIT_PT_VAL = 50;
const EQ_PT_CHANGE = 10;
const MAX_PT_CHANGE = 50;
const MIN_PT_CHANGE = 5;
const WIN_STREAK_BASE = 5;
const WIN_STREAK_START = 3;
const LOSS_PERCT_LOSS = 5;
const MIN_PT = 0;
class Player {
	constructor(firstName, lastName, ID) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.ID = ID;
		this.points = INIT_PT_VAL;
		this.matchesWon = 0;
		this.matchesLost = 0;
		this.winStreak = 0;
		this.winStreakBonus = 0;
		this.lossStreak = 0;
		this.lossPerct = 100;
	}

	description() {
		return this.firstName + this.lastName + this.ID + this.points;
	}

	get name() {
		return this.firstName + " " + this.lastName;
	}

	finishMatch(opponent, win) {
		var change = EQ_PT_CHANGE;

		if (win) {
			this.matchesWon++;
			this.winStreak++;
			this.winStreakBonus += WIN_STREAK_BASE;

			if (this.winStreak >= WIN_STREAK_START) {
				change += this.winStreakBonus;
			}

			if (this.lossStreak > 0) {
				this.lossPerct = 100;
				this.lossStreak = 0;
			}
		}
		else {
			this.matchesLost++;
			change = -change;
			this.lossStreak++;

			if (this.winStreak > 0) {
				this.winStreak = 0;
				this.winStreakBonus = 0;
			}
		}

		if (change > MAX_PT_CHANGE) {
			change = MAX_PT_CHANGE;
		}

		else if (change < -MAX_PT_CHANGE) {
			change = -MAX_PT_CHANGE;
		}

		else if (change > 0 && change < MIN_PT_CHANGE) {
			change = MIN_PT_CHANGE;
		}

		else if (change < 0 && change > -MIN_PT_CHANGE) {
			change = -MIN_PT_CHANGE;
		}

		this.points += change;

		if (this.points < MIN_PT) {
			this.points = MIN_PT;
		}
	}

	static compare(playerOne, playerTwo) {
		if (playerOne.points > playerTwo.points)
			return -1;
		if (playerOne.points < playerTwo.points)
			return 1;
		return 0;
	}
}

class Players {
	constructor() {
		this.list = [];
	}

	add(player) {	
		this.list.push(player);
		this.rank();
	}

	count() {
		return this.list.length;
	}

	getPlayerByID(ID) {
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].ID === ID) {
				return this.list[i];
			}
		}
		return null;
	}

	finishMatch(playerOneID, playerOneScore, playerTwoID, playerTwoScore) {
		var playerOne = this.getPlayerByID(playerOneID);
		var playerTwo = this.getPlayerByID(playerTwoID);

		var playerOneWin = playerOneScore > playerTwoScore;

		playerOne.finishMatch(playerTwo, playerOneWin);
		playerTwo.finishMatch(playerOne, !playerOneWin);

		this.rank();
	}

	rank() {
		this.list.sort(Player.compare);
		var table = document.getElementById("rankings");
		var rows = table.rows;
		var i = rows.length;
		while (--i) {
			table.deleteRow(i);
		}
		i = 0;
		var currRow, rankCell, nameCell, pointCell;
		for(; i < this.list.length; i++) {
			currRow = table.insertRow(-1);
			rankCell = currRow.insertCell(0);
			nameCell = currRow.insertCell(1);
			pointCell = currRow.insertCell(2);
			rankCell.innerHTML = i + 1;
			nameCell.innerHTML = this.list[i].name;
			pointCell.innerHTML = this.list[i].points;
		}
	}

	simulate(numPlayers) {
		
	}
}