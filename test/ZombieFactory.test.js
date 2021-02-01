require("chai").should();

const { soliditySha3, toBN } = require("web3-utils");

const { expectRevert } = require("@openzeppelin/test-helpers");

const ZombieFactory = artifacts.require("ZombieFactory");

contract("ZombieFactory", function ([user0, user1]) {
	beforeEach(async () => {
		this.ZombieFactory = await ZombieFactory.new();
	});

	describe("Creating zombies", () => {
		it("should be able to create zombies", async () => {
			await this.ZombieFactory.createRandomZombie("MyZombie");
		});

		it("should revert when creating zombie without a name", async () => {
			await expectRevert(
				this.ZombieFactory.createRandomZombie(),
				'Invalid number of parameters for "createRandomZombie". Got 0 expected 1!'
			);
		});

		it("should generate random dna calculated using the name", async () => {
			await this.ZombieFactory.createRandomZombie("MyZombie");
			const MyZombie = await this.ZombieFactory.zombies.call([0]);
			const dnaResult = MyZombie[1];

			let expectedDna = soliditySha3("MyZombie");
			// Removes "0x" from the hash and converts it to BN, then applies modulo
			expectedDna = toBN(expectedDna.slice(2)).mod(toBN(10 ** 16));

			dnaResult.should.be.bignumber.equal(expectedDna);
		});
	});
});
