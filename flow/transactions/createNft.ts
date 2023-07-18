export const createNftTransaction = `
  import Storyverse from 0x722f79f3ee87e7fe

  transaction(metadata: String) {

    prepare(acct: AuthAccount, receiverAcc: AuthAccount) {
      let minterRef = acct.borrow<&Storyverse.NFTMinter>(from: /storage/StoryverseNFTMinter)
          ?? panic("Could not borrow a reference to the NFTMinter")

      let nft <- minterRef.mintNFT(metadata: metadata)

      let collectionPath = /public/StoryverseNFTCollection
          
      if !receiverAcc.getCapability<&Storyverse.Collection>(collectionPath).check() {
          // Collection doesn't exist, create it
          let collection <- Storyverse.createEmptyCollection()
          receiverAcc.save(<-collection, to: /storage/StoryverseNFTCollection)
          receiverAcc.link<&Storyverse.Collection>(collectionPath, target: /storage/StoryverseNFTCollection)
      }

      let collectionRef = receiverAcc.getCapability(collectionPath)
          .borrow<&Storyverse.Collection>() 
          
      collectionRef!.deposit(token: <-nft)
    }

    execute {
      log(Storyverse.getTotalSupply())
    }
  }
`