import { expect } from "chai";
import { TextChannel, User } from "discord.js";
import { IMock, Mock } from "typemoq";

import Diplomacy from "../../managers/Diplomacy";

describe("Diplomacy", function () {
  const createUser = (id: string, username: string): [User, IMock<User>] => {
    const user = Mock.ofType<User>();
    user.setup((x) => x.id).returns(() => id);
    user.setup((x) => x.username).returns(() => username);
    return [user.object, user];
  };

  let channel: TextChannel;
  let channelMock: IMock<TextChannel>;

  beforeEach(function () {
    channelMock = Mock.ofType<TextChannel>();
    channel = channelMock.object;
  });

  it("should prevent adding more players than capacity", function () {
    const diplomacy = new Diplomacy(channel, 2);
    diplomacy.addPlayer(createUser("A", "A")[0], "A");
    diplomacy.addPlayer(createUser("B", "B")[0], "B");
    diplomacy.addPlayer(createUser("C", "C")[0], "C");
    expect(diplomacy.getPlayerCount()).to.be.equal(2);
  });

  it("shoud allow player to change their orders", function () {
    const diplomacy = new Diplomacy(channel, 7);
    const [user] = createUser("007", "james_bond");
    diplomacy.addPlayer(user, "Britain");
    expect(diplomacy.setOrders(user, "rush b")).to.be.true;
    expect(diplomacy.setOrders(user, "smoke a")).to.be.true;
  });

  it("shold prevent player from voting before giving orders", function () {
    const diplomacy = new Diplomacy(channel, 2);
    const [user] = createUser("007", "james_bond");
    diplomacy.addPlayer(user, "Britain");
    diplomacy.voteForReveal(user);
    expect(diplomacy.getCurrentVotes()).to.be.equal(0);
    diplomacy.setOrders(user, "rush b");
    diplomacy.voteForReveal(user);
    expect(diplomacy.getCurrentVotes()).to.be.equal(1);
  });

  it("should not count player votes multiple times", function () {
    const diplomacy = new Diplomacy(channel, 2);
    const [user] = createUser("007", "james_bond");
    diplomacy.addPlayer(user, "Britain");
    diplomacy.setOrders(user, "rush b");
    diplomacy.voteForReveal(user);
    diplomacy.voteForReveal(user);
    expect(diplomacy.getCurrentVotes()).to.be.equal(1);
  });

  it("should reset orders and votes after reveal", function () {
    const diplomacy = new Diplomacy(channel, 2);
    const [userA] = createUser("A", "A");
    diplomacy.addPlayer(userA, "A");
    diplomacy.setOrders(userA, "A");
    const [userB] = createUser("B", "B");
    diplomacy.addPlayer(userB, "B");
    diplomacy.setOrders(userB, "B");

    expect(diplomacy.getCurrentOrders()).to.be.equal(2);
    expect(diplomacy.getCurrentVotes()).to.be.equal(0);
    diplomacy.voteForReveal(userA);
    expect(diplomacy.getCurrentVotes()).to.be.equal(1);
    diplomacy.voteForReveal(userB);
    expect(diplomacy.getCurrentVotes()).to.be.equal(0);
    expect(diplomacy.getCurrentOrders()).to.be.equal(0);
  });
});
