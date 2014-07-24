Array.prototype.indexOf = function (item, caseSensitive)
{	
	if (caseSensitive === undefined)
	{
		caseSensitive = false;
	}

	for (var i = 0; i < this.length; i++)
	{
		if ((cmp(this[i], item) && !caseSensitive) || this[i] === item)
		{
			return i;
		}
	}

	return -1;
};

String.prototype.indexOf = function(str)
{
	if (str === undefined || str.length === 0 || str.length > this.length)
		return -1;
	if (cmp(str, this))
		return 0;

	for (var i = 0; i < this.length; i++)
	{
		if (cmp(this.substr(i, str.length), str))
		{
			return i;
		}
	}

	return -1;
};

String.prototype.contains = function(str)
{
	return this.indexOf(str) !== -1;
};

Array.prototype.contains = function(item)
{
	return this.indexOf(item) !== -1;
};

Number.prototype.isPowerOfTwo = function()
{
	return this > 0 && this & (this - 1) === 0;
};

Array.prototype.shuffle = function()
{
    for (var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
	
    return this;
};

Utilities =
({
	webCall: function(url, args)
	{
		// prevent weird webcall bug //
		
		if (!cache.webCalling)
		{
			cache.webCalling = true;
			
			var ret;
			
			if (args === undefined)
				ret = sys.synchronousWebCall(url);
			else
				ret = sys.synchronousWebCall(url, args);
			
			while (ret === undefined)
			{
				// wait
			}
			
			cache.webCalling = false;
			
			return ret;
		}
		
		printMessage("<b>A webcall is currently in progress - try again later.</b>");
		return "";
	},
	channelNames: function()
	{
		var ret = [];
		
		var channels = client.channelNames();
		
		for (var channel in channels)
		{
			if (channels.hasOwnProperty(channel))
			{
				ret.push(channels[channel]);
			}
		}
		
		return ret;
	},
	isChannel: function(name)
	{
		return this.channelNames().contains(name);
	},
	readFile: function(file)
	{
		return sys.getFileContent(file);
	},
	writeFile: function(file, contents)
	{
		sys.writeToFile(file, contents);
	},
	appendFile: function(file, contents)
	{
		sys.appendToFile(file, contents);
	},
	getMessage: function(message)
	{
		return (message.indexOf(": ") !== -1 ? message.substr(message.indexOf(":") + 2) : message);
	},
	getUser: function(message)
	{
		return (message.indexOf(": ") !== -1 ? message.split(": ")[0] : undefined); // throw some sort of error if we're doing something we shouldn't be
	},
	isPlayerOnline: function(name)
	{
		return client.id(name) !== -1;
	},
	isPlayerBattling: function(id)
	{
		return (client.player(id).flags & (1 << 2)) > 0;
	},
	escapeRegex: function(text)
	{
		return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	},
	capitalize: function(str)
	{
		str = str.toLowerCase();
		
		if (str.indexOf(" ") !== -1)
		{
			var _str = str.split(" ");
			
			for (var i = 0; i < _str.length; i++)
			{
				_str[i] = this.capitalize(_str[i]);
			}
			
			str = _str.join(" ");
		}
		
		if (str.indexOf("-") !== -1)
		{
			var _str = str.split("-");
			
			for (var i = 0; i < _str.length; i++)
			{
				_str[i] = this.capitalize(_str[i]);
			}
			
			str = _str.join("-");
		}
	
		return str.charAt(0).toUpperCase() + (str.length > 1 ? str.substr(1) : "");
	},
	randomInt: function(arg1, arg2)
	{
		if (arg2 !== undefined) // randomInt(min, max)
		{
			return Math.floor(Math.random() * (arg2 - arg1)) + arg1;
		}
		else // randomInt(max)
		{
			return Math.floor(Math.random() * arg1);
		}
	},
	hexToRgb: function(hex)
	{
		hex = hex.toString();

		hex = hex.replace(/#/g, "");

		var bigint = parseInt(hex, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;

		return "(%1, %2, %3)".args(r, g, b);
	},
	formatTime: function(seconds, longv) // longv is true if 5 hours, 2 minutes, and 4 seconds instead of 05:02:04
	{
		var h = Math.floor(seconds / 3600);
		var m = Math.floor((seconds - h * 3600) / 60);
		var s = seconds % 60;
		
		if (longv)
		{
			return "%1 hours, %2 minutes, and %3 seconds".args(h, m, s);
		}
		else
		{
			return "%1:%2:%3".args((h < 10 ? "0" + h : h), (m < 10 ? "0" + m : m), (s < 10 ? "0" + s : s));
		}
	},
	secondsFromString: function(str)
	{
		var t = str;
		
		if (t.toLowerCase().endsWith("s"))
		{
			t = t.substr(0, t.length - 1);
		}
		else if (t.toLowerCase().endsWith("m"))
		{
			t = t.substr(0, t.length - 1);
			
			if (isNaN(t) || parseFloat(t) <= 0)
			{
				return 0;
			}
				
			t *= 60; // mins -> seconds
		}
		else if (t.toLowerCase().endsWith("h"))
		{
			t = t.substr(0, t.length - 1);
			
			if (isNaN(t) || parseFloat(t) <= 0)
			{
				return 0;
			}
			
			t *= 3600; // hours -> seconds
		}
		
		if (isNaN(t) || parseFloat(t) <= 0)
		{
			return 0;
		}
		
		return t;
	},
	multiplyString: function(str, amt)
	{
		var ret = "";
		
		for (var i = 0; i < amt; i++)
		{
			ret += str;
		}
		
		return ret;
	}
});

var __channels = [ "! 0" ];
var __names = [ "ßroken Glass" ];
var network = client.network();
var border = "»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»:";
var tours = [];

function say(message, channel)
{
	if (channel === undefined)
		channel = client.currentChannel();
		
	network.sendChanMessage(channel, message);
}

function me(message, channel)
{
	say("/me " + message, channel);
}

function Tour(amt)
{
	if (!amt.isPowerOfTwo())
	{
		while (!amt.isPowerOfTwo())
		{
			amt++;
		}
	}
	
	this.amount = amt;
	this.players = [];
	this.state = "signups";
	this.round = 0;
	this.nextRound = [];
}

Tour.prototype.matchups = function()
{
	if (!this.state === "running")
		return undefined;
		
	var ret = [];
	
	for (var i = 0; i < this.amount / 2; i++)
	{
		ret.push([ this.players[i * 2], this.players[i * 2 + 1] ]);
	}
	
	return ret;
};

Tour.prototype.add = function(id)
{
	if (this.state === "signups")
	{
		this.players.push(id);
		
		if (this.players.length === this.amount)
		{
			this.state = "running";
			this.players.shuffle();
			this.round = 1;
			
			this.printRound();
		}
	}
};

Tour.prototype.printRound = function(channel)
{
	if (this.state === "running")
	{
		var m = this.matchups();
		
		me(border, channel);
		me("****** ROUND " + this.round + " ******", channel);
		
		for (var i = 0; i < m.length; i++)
		{
			me(m[i][0] + " VS " + m[i][1], channel);
		}
		
		me(border, channel);
	}
};

Tour.prototype.hasPlayer = function(id)
{
	return this.players.contains(id);
};

Tour.prototype.matchupOf = function(id)
{
	if (!this.hasPlayer(id))
		return -1;
		
	var m = this.matchups();
	
	for (var i = 0; i < m.length; i++)
	{
		if (m[i].contains(id))
			return i;
	}
	
	return -1;
};

Tour.prototype.decideMatchup(matchup, winner)
{
	// winner should be 0 or 1 //
	
	var m = this.matchups()[matchup];
	
	var w = m.splice(winner, 1);
	var l = m[0];
	
	this.players.splice(this.players.indexOf(l), 1);
};

Tour.prototype.hasMatchup(p1, p2)
{
	if (this.state !== "running")
		return false;
		
	var m = this.matchups();
	
	for (var i = 0; i < m.length; i++)
	{
		
	}
};

({

	afterChannelMessage: function(message, channel, html)
	{
		if (!__names.contains(client.ownName()) || !__channels.contains(client.channelName(channel)))
		{
			return;
		}
		
		
	},
	onBattleStarted: function(bid, p1, p2, tier, mode)
	{
		
	},
	onBattleFinished: function(bid, winner, loser, res)
	{
		for (var i = 0; i < tours.length; i++)
		{
			if (tours[i].hasPlayer(winner
		}
	},

});