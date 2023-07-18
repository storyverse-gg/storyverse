// Storyverse.cdc
//
// Welcome to Cadence! This is one of the simplest programs you can deploy on Flow.
//
// The HelloWorld contract contains a single string field and a public getter function.
//
// Follow the "Hello, World!" tutorial to learn more: https://docs.onflow.org/cadence/tutorial/02-hello-world/

access(all) contract Storyverse {

    // Declare a public field of type String.
    //
    // All fields must be initialized in the init() function.
    access(all) var totalSupply: UInt256

    access(all) var owners: [Address]

    pub resource Collection {
        // Dictionary to hold the NFTs
        pub var ownedNFTs: @{UInt256: Storyverse.StoryverseNFT}

        // Initialize the collection
        init() {
            self.ownedNFTs <- {}
        }

        // Function to add an NFT to the collection
        pub fun deposit(token: @Storyverse.StoryverseNFT) {
            let tokenId = token.tokenId
            self.ownedNFTs[tokenId] <-! token
            if !Storyverse.owners.contains(self.owner!.address) {
                Storyverse.owners.append(self.owner!.address)
            }
        }

        // Function to remove an NFT from the collection
        pub fun withdraw(tokenId: UInt256): @Storyverse.StoryverseNFT {
            let token <- self.ownedNFTs.remove(key: tokenId)
                ?? panic("No such token in the collection!")
            return <- token
        }
        
        pub fun getIds(): [UInt256] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(tokenId: UInt256): &StoryverseNFT? {
            return &self.ownedNFTs[tokenId] as &StoryverseNFT?
        }
        
        destroy() {
            destroy self.ownedNFTs
        }
    }
    
    pub resource StoryverseNFT {
        pub let tokenId: UInt256 
        pub var metadata: String // Stored on IPFS

        init(metadata: String) {
            self.tokenId = (Storyverse.totalSupply + 1)
            self.metadata = metadata

            Storyverse.totalSupply = Storyverse.totalSupply + 1
        }

        access(contract) fun upgradeNFT(metadata: String) {
            self.metadata = metadata
        }
        
    }

    // Public function that returns our friendly greeting!
    access(all) fun getTotalSupply(): UInt256 {
        return self.totalSupply
    }

    pub resource NFTMinter {
        pub fun mintNFT(metadata: String): @StoryverseNFT {
            return <- create StoryverseNFT(metadata: metadata)
        }

        pub fun upgradeNFT(nft: &StoryverseNFT, newMetadata: String) {
            nft.upgradeNFT(metadata: newMetadata)
        }
    }

    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // The init() function is required if the contract contains any fields.
    init() {
        self.totalSupply = 0
        self.owners = []
        self.account.save(<- create NFTMinter(), to: /storage/StoryverseNFTMinter)
    }
}
