const Discord = require("discord.js");
const Client = new Discord.Client();
const fs = require("fs");
const request = require("request");
const Prefix = ".";
const Token = "NzkzNDM1NTI3NjEyODU4Mzk5.X-sOaw.jqgk7fhJnwDOvB158G6hR09ZUI0";

Client.on("ready", function() {
    console.log("ALTSHOP Ready!\nBot Start: " + new Date().toLocaleString());
    setInterval(function() {
        var MemberCount = 0;
        Client.guilds.cache.forEach(function(guild) {
            MemberCount += guild.memberCount;
        });
        Client.user.setActivity(Client.guilds.cache.size + " Guilds, " + MemberCount + " Members [" + Prefix + "help]", { type: "WATCHING" });
    }, 10000);
});

Client.on("message", async function(message) {
    if (message.content.toLowerCase() === Prefix + "help") {
        await message.channel.send(new Discord.MessageEmbed()
            .setTitle("✅ 명령어")
            .addField(Prefix + "additem [아이템 이름] \\`[아이템]\\`", "[아이템 이름] 에 [아이템]을 추가합니다")
            .addField(Prefix + "additems [아이템 이름]", "[아이템 이름] 에 첨부파일로 업로드한 아이템들을 추가합니다")
            .addField(Prefix + "createitem [아이템 이름]", "[아이템 이름] 을 추가합니다")
            .addField(Prefix + "gen [아이템 이름]", "[아이템 이름] 을 생성합니다")
            .addField(Prefix + "핑", "봇의 현재 핑을 확인합니다")
            .addField(Prefix + "removeitem [아이템 이름]", "[아이템 이름] 을 삭제합니다")
            .addField(Prefix + "resetguild", "서버의 모든 설정을 초기화합니다")
            .addField(Prefix + "setupguild", "서버를 설정합니다")
            .addField(Prefix + "stock", "아이템들의 재고를 확인합니다")
            .setFooter("Bot made by BADA248")
            .setColor(0x00FF00));
    }
    else if (message.content.toLowerCase().startsWith(Prefix + "additem ")) {
        fs.readFile("./Data/" + message.guild.id + "/Config.json", async function(err, data) {
            if (err) {
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 오류가 발생하였습니다!")
                    .setDescription(err.message.toString())
                    .setColor(0xFF0000));
                throw err;
            }
            if (message.member.roles.cache.get(JSON.parse(data.toString())["AdminID"])) {
                var FilePath = "./Data/" + message.guild.id + "/Items/" + message.content.split("`")[0].replace(Prefix + "additem ", "").trim() + ".txt";
                if (!fs.existsSync(FilePath)) return message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 존재하지 않는 아이템입니다!")
                    .setColor(0xFF0000));
                fs.readFile(FilePath, async function(err, data) {
                    if (err) {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 오류가 발생하였습니다!")
                            .setDescription(err.message.toString())
                            .setColor(0xFF0000));
                        throw err;
                    }
                    fs.writeFile(FilePath, (data.toString() + "\n" + message.content.split("`")[1]).replace("\n\n", "\n").trim() + "\n", async function(err) {
                        if (err) {
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("❌ 오류가 발생하였습니다!")
                                .setDescription(err.message.toString())
                                .setColor(0xFF0000));
                            throw err;
                        }
                        return message.channel.send(new Discord.MessageEmbed()
                            .setTitle("✅ 아이템이 추가되었습니다!")
                            .setColor(0x00FF00));
                    });
                });
            }
        });
    }
    else if (message.content.toLowerCase().startsWith(Prefix + "additems ")) {
        fs.readFile("./Data/" + message.guild.id + "/Config.json", async function(err, data) {
            if (err) {
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 오류가 발생하였습니다!")
                    .setDescription(err.message.toString())
                    .setColor(0xFF0000));
                throw err;
            }
            if (message.member.roles.cache.get(JSON.parse(data.toString())["AdminID"])) {
                var FilePath = "./Data/" + message.guild.id + "/Items/" + message.content.replace(Prefix + "additems ", "") + ".txt";
                if (!fs.existsSync(FilePath)) return message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 존재하지 않는 아이템입니다!")
                    .setColor(0xFF0000));
                fs.readFile(FilePath, async function(err, data) {
                    if (err) {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 오류가 발생하였습니다!")
                            .setDescription(err.message.toString())
                            .setColor(0xFF0000));
                        throw err;
                    }
                    request(message.attachments.first().url, async function(err, response) {
                        if (err) {
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("❌ 오류가 발생하였습니다!")
                                .setDescription(err.toString())
                                .setColor(0xFF0000));
                            throw err;
                        }
                        fs.writeFile(FilePath, (data.toString() + "\n" + response.body + "\n").replace("\n\n", "\n").trim(), async function(err) {
                            if (err) {
                                await message.channel.send(new Discord.MessageEmbed()
                                    .setTitle("❌ 오류가 발생하였습니다!")
                                    .setDescription(err.message.toString())
                                    .setColor(0xFF0000));
                                throw err;
                            }
                            return message.channel.send(new Discord.MessageEmbed()
                                .setTitle("✅ 아이템(들)이 추가되었습니다!")
                                .setColor(0x00FF00));
                        });
                    });
                });
            }
        });
    }
    else if (message.content.toLowerCase().startsWith(Prefix + "createitem ")) {
        fs.readFile("./Data/" + message.guild.id + "/Config.json", async function(err, data) {
            if (err) {
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 오류가 발생하였습니다!")
                    .setDescription(err.message.toString())
                    .setColor(0xFF0000));
                throw err;
            }
            if (message.member.roles.cache.get(JSON.parse(data.toString())["AdminID"])) {
                if (fs.existsSync("./Data/" + message.guild.id + "/Items/" + message.content.toLowerCase().replace(Prefix + "createitem ", "") + ".txt")) return message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 이미 등록되어 있습니다!")
                    .setDescription("❗ " + Prefix + "removeitem 을 먼저 사용해주세요!")
                    .setColor(0xFF0000));
                fs.writeFile("./Data/" + message.guild.id + "/Items/" + message.content.toLowerCase().replace(Prefix + "createitem ", "") + ".txt", "", async function(err) {
                    if (err) {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 오류가 발생하였습니다!")
                            .setDescription(err.message.toString())
                            .setColor(0xFF0000));
                        throw err;
                    }
                    return message.channel.send(new Discord.MessageEmbed()
                        .setTitle("✅ 아이템 생성이 완료되었습니다!")
                        .setColor(0x00FF00));
                });
            }
        });
        
    }
    else if (message.content.toLowerCase().startsWith(Prefix + "gen")) {
        fs.readFile("./Data/" + message.guild.id + "/Config.json", async function(err, data) {
            if (err) {
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 오류가 발생하였습니다!")
                    .setDescription(err.message.toString())
                    .setColor(0xFF0000));
                throw err;
            }
			if (message.channel.id !== JSON.parse(data.toString())["ChannelID"]) return message.channel.send(new Discord.MessageEmbed()
				.setTitle("❌ 생성 채널에서만 생성이 가능합니다!")
				.setDescription("생성 채널: <#" + JSON.parse(data.toString())["ChannelID"] + ">")
				.setColor(0xFF0000));
            if (message.member.roles.cache.get(JSON.parse(data.toString())["BuyerID"])) return GenerateAccount(message, "./Data/" + message.guild.id + "/Items/" + message.content.toLowerCase().replace(Prefix + "gen ", "") + ".txt", "✅ " + message.content.toLowerCase().replace(Prefix + "gen ", "") + " 계정이 생성되었습니다!");
        });
    }
    else if (message.content.toLowerCase() === Prefix + "ping") {
        await message.channel.send(new Discord.MessageEmbed()
            .setTitle("✅ 핑")
            .addField("메시지 수신", (Date.now() - message.createdTimestamp) + "ms")
            .addField("API", Client.ws.ping + "ms")
            .setColor(0x00FF00));
    }
    else if (message.content.toLowerCase().startsWith(Prefix + "removeitem ")) {
        fs.readFile("./Data/" + message.guild.id + "/Config.json", async function(err, data) {
            if (err) {
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 오류가 발생하였습니다!")
                    .setDescription(err.message.toString())
                    .setColor(0xFF0000));
                throw err;
            }
            if (message.member.roles.cache.get(JSON.parse(data.toString())["AdminID"])) {
                var RandomString = Math.random().toString(36).substring(5).toUpperCase();
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❓ 정말로 아이템을 삭제하시려면 1분 이내에 " + Prefix + "confirm removeitem " + RandomString + " 을(를) 입력해주세요!")
                    .setColor(0x00FFFF));
                var RemoveItemFilter = m => {
                    if (m.author.id === message.author.id && m.content.toUpperCase() === Prefix + "CONFIRM REMOVEITEM " + RandomString) return true;
                };
                if (await message.channel.awaitMessages(RemoveItemFilter, {max: 1, time: 60000, errors: ["time"]})) {
                    fs.unlinkSync("./Data/" + message.guild.id + "/Items/" + message.content.toLowerCase().replace(Prefix + "removeitem ", "") + ".txt");
                    await message.channel.send(new Discord.MessageEmbed()
                        .setTitle("✅ 아이템이 삭제되었습니다!")
                        .setColor(0x00FF00));
                }
            }
        });
    }
    else if (message.content.toLowerCase() === Prefix + "resetguild") {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            var RandomString = Math.random().toString(36).substring(5).toUpperCase();
            await message.channel.send(new Discord.MessageEmbed()
                .setTitle("❓ 정말로 설정을 초기화하시려면 1분 이내에 " + Prefix + "confirm resetguild " + RandomString + " 을(를) 입력해주세요!")
                .setColor(0x00FFFF));
            var UnRegisterFilter = m => {
                if (m.author.id === message.author.id && m.content.toUpperCase() === Prefix + "CONFIRM RESETGUILD " + RandomString) return true;
            };
            if (await message.channel.awaitMessages(UnRegisterFilter, {max: 1, time: 60000, errors: ["time"]})) {
                fs.rmdir("./Data/" + message.guild.id, { recursive: true }, async function(err) {
                    if (err) {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 오류가 발생하였습니다!")
                            .setDescription(err.message.toString())
                            .setColor(0xFF0000));
                        throw err;
                    }
                });
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("✅ 설정이 초기화되었습니다!")
                    .setColor(0x00FF00));
            }
        }
    }
    else if (message.content.toLowerCase() === Prefix + "setupguild") {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (fs.existsSync("./Data/" + message.guild.id)) return message.channel.send(new Discord.MessageEmbed()
                .setTitle("❌ 이미 등록되어 있습니다!")
                .setDescription("❗ " + Prefix + "resetguild 를 먼저 사용해주세요!")
                .setColor(0xFF0000));
            
            var AdminID;
            var BuyerID;
			var ChannelID;
            var AdminIDFilter = async m => {
                try {
                    if (m.author.id === message.author.id) {
                        if (Number(m.content) > 0) {
                            AdminID = m.content;
                            return true;
                        }
                        else {
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("❌ 관리자 역할 ID를 입력해주세요!")
                                .setColor(0xFF0000));
                        }
                    }
                }
                catch (err) {
                    await message.channel.send(new Discord.MessageEmbed()
                        .setTitle("❌ 오류가 발생하였습니다!")
                        .setDescription(err.message.toString())
                        .setColor(0xFF0000));
                }
            }
            var BuyerIDFilter = async m => {
                try {
                    if (m.author.id === message.author.id) {
                        if (Number(m.content) > 0) {
                            BuyerID = m.content;
                            return true;
                        }
                        else {
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("❌ 구매자 역할 ID를 입력해주세요!")
                                .setColor(0xFF0000));
                        }
                    }
                }
                catch (err) {
                    await message.channel.send(new Discord.MessageEmbed()
                        .setTitle("❌ 오류가 발생하였습니다!")
                        .setDescription(err.message.toString())
                        .setColor(0xFF0000));
                }
            }
			var ChannelIDFilter = async m => {
                try {
                    if (m.author.id === message.author.id) {
                        if (Number(m.content) > 0) {
                            ChannelID = m.content;
                            return true;
                        }
                        else {
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("❌ 채널 ID를 입력해주세요!")
                                .setColor(0xFF0000));
                        }
                    }
                }
                catch (err) {
                    await message.channel.send(new Discord.MessageEmbed()
                        .setTitle("❌ 오류가 발생하였습니다!")
                        .setDescription(err.message.toString())
                        .setColor(0xFF0000));
                }
            }
            await message.channel.send(new Discord.MessageEmbed()
                .setTitle("❓ 관리자 역할 ID를 입력해주세요!")
                .setColor(0x00FFFF));
            await message.channel.awaitMessages(AdminIDFilter, {max: 1, time: 60000, errors: ["time"]});
            await message.channel.send(new Discord.MessageEmbed()
                .setTitle("❓ 구매자 역할 ID를 입력해주세요!")
                .setColor(0x00FFFF));
            await message.channel.awaitMessages(BuyerIDFilter, {max: 1, time: 60000, errors: ["time"]});
			await message.channel.send(new Discord.MessageEmbed()
                .setTitle("❓ 생성 채널 ID를 입력해주세요!")
                .setColor(0x00FFFF));
			await message.channel.awaitMessages(ChannelIDFilter, {max: 1, time: 60000, errors: ["time"]});
			fs.mkdir("./Data/" + message.guild.id, async function(err) {
                if (err) {
                    await message.channel.send(new Discord.MessageEmbed()
                        .setTitle("❌ 오류가 발생하였습니다!")
                        .setDescription(err.message.toString())
                        .setColor(0xFF0000));
                    throw err;
                }
				fs.mkdir("./Data/" + message.guild.id + "/Items", async function(err) {
					if (err) {
						await message.channel.send(new Discord.MessageEmbed()
							.setTitle("❌ 오류가 발생하였습니다!")
							.setDescription(err.message.toString())
							.setColor(0xFF0000));
						throw err;
                    }
					fs.writeFile("./Data/" + message.guild.id + "/Config.json", "{\"AdminID\":\"" + AdminID + "\",\"BuyerID\":\"" + BuyerID + "\",\"ChannelID\":\"" + ChannelID + "\"}", async function(err) {
						if (err) {
							await message.channel.send(new Discord.MessageEmbed()
								.setTitle("❌ 오류가 발생하였습니다!")
								.setDescription(err.message.toString())
								.setColor(0xFF0000));
							throw err;
						}
						fs.writeFile("./Data/" + message.guild.id + "/Users.json", "{}", async function(err) {
							if (err) {
								await message.channel.send(new Discord.MessageEmbed()
									.setTitle("❌ 오류가 발생하였습니다!")
									.setDescription(err.message.toString())
									.setColor(0xFF0000));
								throw err;
							}
							await message.channel.send(new Discord.MessageEmbed()
								.setTitle("✅ 설정이 완료되었습니다!")
								.setColor(0x00FF00));
						});
					});
				});
            });
        }
    }
    else if (message.content.toLowerCase() === Prefix + "stock") {
        fs.readdir("./Data/" + message.guild.id + "/Items/", async function(err, files) {
            if (err) {
                await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("❌ 오류가 발생하였습니다!")
                    .setDescription(err.message.toString())
                    .setColor(0xFF0000));
                throw err;
            }
            if (files.length === 0) return message.channel.send(new Discord.MessageEmbed()
                .setTitle("✅ 재고")
                .setDescription("아이템이 없습니다!\n" + Prefix + "createitem [아이템 이름] 을 입력하여 아이템을 생성해주세요!")
                .setColor(0x00FF00));
            var Items = 0;
            var StockEmbed = new Discord.MessageEmbed()
                .setTitle("✅ __**현재 재고입니다.**__\n**✩** 재고 소진시 빠르게 입고하겠습니다!")
                .setColor(0x00FF00);
            files.forEach(function(file) {
                fs.readFile("./Data/" + message.guild.id + "/Items/" + file, async function(err, data) {
                    if (err) {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 오류가 발생하였습니다!")
                            .setDescription(err.message.toString())
                            .setColor(0xFF0000));
                        throw err;
                    }
                    data = data.toString().replace("\n\n", "\n").trim();
                    if (data.toString().split("\n")[0] === "") StockEmbed.addField(file.replace(".txt", ""), "0개");
                    else StockEmbed.addField(file.replace(".txt", ""), data.toString().split("\n").length + "개");
                    Items++;
                    if (Items === files.length) await message.channel.send(StockEmbed);
                });
            });
        });
    }
});

function GenerateAccount(message, AccountPath, DMMessage) {
    fs.readFile("./Data/" + message.guild.id + "/Users.json", async function(err, userData) {
        if (err) {
            await message.channel.send(new Discord.MessageEmbed()
                .setTitle("❌ 오류가 발생하였습니다!")
                .setDescription(err.message.toString())
                .setColor(0xFF0000));
            throw err;
        }
        userData = JSON.parse(userData.toString());
        if (userData[message.author.id] > Date.now()) {
            await message.channel.send(new Discord.MessageEmbed()
                .setTitle("❌ 계정은 1분마다 한 개씩 생성할 수 있습니다!")
                .setColor(0xFF0000));
        }
        else {
            userData[message.author.id] = Date.now() + 60000;
            fs.writeFile("./Data/" + message.guild.id + "/Users.json", JSON.stringify(userData), async function(err) {
                if (err) {
                    await message.channel.send(new Discord.MessageEmbed()
                        .setTitle("❌ 오류가 발생하였습니다!")
                        .setDescription(err.message.toString())
                        .setColor(0xFF0000));
                    throw err;
                }
                fs.readFile(AccountPath, async function(err, data) {
                    if (err) {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 오류가 발생하였습니다!")
                            .setDescription(err.message.toString())
                            .setColor(0xFF0000));
                        throw err;
                    }
                    data = data.toString().trim();
                    const Token = data.toString().split("\n")[0];
                    if (Token === "") {
                        await message.channel.send(new Discord.MessageEmbed()
                            .setTitle("❌ 재고가 없습니다! 재고가 충전될 때까지 기다려 주세요!")
                            .setColor(0xFF0000));
                    }
                    else {
                        try {
                            await message.author.send(new Discord.MessageEmbed()
                                .setTitle(DMMessage)
                                .setDescription(Token)
                                .setColor(0x00FF00));
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("✅ DM (개인 채팅) 을 확인해주세요!")
                                .setColor(0x00FF00));
                            fs.writeFile(AccountPath, data.toString().replace(Token, "").trim() + "\n", async function(err) {
                                if (err) {
                                    await message.channel.send(new Discord.MessageEmbed()
                                        .setTitle("❌ 오류가 발생하였습니다!")
                                        .setDescription(err.message.toString())
                                        .setColor(0xFF0000));
                                    throw err;
                                }
                            });
                        }
                        catch {
                            await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("❌ DM (개인 채팅) 이 꺼져 있습니다! 설정에서 활성화해주세요!")
                                .setColor(0xFF0000));
                            userData[message.author.id] = Date.now();
                            fs.writeFile("./Data/" + message.guild.id + "/Users.json", JSON.stringify(userData), async function(err) {
                                if (err) {
                                    await message.channel.send(new Discord.MessageEmbed()
                                        .setTitle("❌ 오류가 발생하였습니다!")
                                        .setDescription(err.message.toString())
                                        .setColor(0xFF0000));
                                    throw err;
                                }
                            });
                        }
                    }
                });
            });
        }
    });
}









  






Client.login(Token);