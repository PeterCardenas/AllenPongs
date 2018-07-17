const INIT_PT_VAL      = 50;
const EQ_PT_CHANGE     = 10;
//const MAX_PT_CHANGE    = 50;
const MIN_PT_GAIN      = 10;
const MIN_PT_LOSS      = 0;
const STREAK_START     = 3;
const WIN_STREAK_BASE  = 5;
const LOSS_PERCT_LOSS  = .05;
const MIN_PT           = 0;
const WEAK_MULTIPLIER  = .3;
const MIN_DIFF_FOR_MAX = 50;
const NUM_BARS_GRAPH   = 8;

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
		this.lossPerct = 1;
	}

	get description() {
		return this.firstName + this.lastName + this.ID + this.points;
	}

	get name() {
		return this.firstName + " " + this.lastName;
	}

	finishMatch(opponent, win) {
		var change = EQ_PT_CHANGE;
		var pointDiff = Math.abs(this.points - opponent.points)
		var max_change = pointDiff / 2;

		if (this.points < opponent.points) {
			this.points += pointDiff * WEAK_MULTIPLIER;
		}

		if (pointDiff >= MIN_DIFF_FOR_MAX && change > pointDiff / 2) {
				change = pointDiff / 2;
		}

		if (win) {
			this.matchesWon++;
			this.winStreak++;
			this.winStreakBonus += WIN_STREAK_BASE;

			if (change > 0 && change < MIN_PT_GAIN) {
				change = MIN_PT_GAIN;
			}

			if (this.winStreak >= STREAK_START) {
				change += this.winStreakBonus;
			}

			if (this.lossStreak > 0) {
				this.lossPerct = 1;
				this.lossStreak = 0;
			}
		}
		else {
			this.matchesLost++;
			this.lossStreak++;

			if (change < MIN_PT_LOSS) {
				change = MIN_PT_LOSS;
			}

			change = -change;

			if (this.lossPerct > 0) {
				this.lossPerct -= LOSS_PERCT_LOSS;
			}

			if (this.lossStreak >= STREAK_START) {
				change = change * this.lossPerct;
			}

			if (this.winStreak > 0) {
				this.winStreak = 0;
				this.winStreakBonus = 0;
			}
		}

		this.points += change;

		this.points = parseInt(this.points, 10);

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

	get count() {
		return this.list.length;
	}

	get graphData() {
		var max = Math.ceil((this.list[0] / NUM_BARS_GRAPH) / 10) * 10;
		return null;
	}

	getPlayerByID(ID) {
		for (var i = 0; i < this.count; i++) {
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
		for (; i < this.count; i++) {
			currRow = table.insertRow(-1);
			rankCell = currRow.insertCell(0);
			nameCell = currRow.insertCell(1);
			pointCell = currRow.insertCell(2);
			rankCell.innerHTML = i + 1;
			nameCell.innerHTML = this.list[i].name;
			pointCell.innerHTML = this.list[i].points;
		}
	}
}

class SimPlayer extends Player {
	constructor(index) {
		super("Player", index, index);
		this.skill = 0;
	}

	finishMatch(opponent, win) {
		super.finishMatch(opponent, win);
	}
}

class Simulation extends Players {
	constructor(numPlayers) {
		super();

		for (var i = 1; i <= numPlayers; i++) {
			this.add(new SimPlayer(i));
		}
	}

	reset(numPlayers) {
		this.list = [];
		for (var i = 1; i <= numPlayers; i++) {
			this.add(new SimPlayer(i));
		}
	}

	doMatch(playerOne, playerTwo) {
		var playerOneWin = Math.floor(Math.random() * 2 + 1) == 1;
		playerOne.finishMatch(playerTwo, playerOneWin);
		playerTwo.finishMatch(playerOne, !playerOneWin);
		this.rank();
	}

	doAllMatches() {
		for (var i = 0; i < this.count; i++) {
			for (var j = i; j < this.count; j++) {
				this.doMatch(this.list[i], this.list[j]);
			}
		}
	}
}