export const getAllNfts = `
  import Storyverse from 0x722f79f3ee87e7fe

  pub fun main(acct: Address): String {
      let accs = Storyverse.owners

      for acc in accs {
        let act = getAccount(acc)
        let collectionRef = act.getCapability(/public/StoryverseNFTCollection).borrow<&Storyverse.Collection>() ?? panic("fat gyi")

        let ids = collectionRef.getIds()

        for id in ids {
          log(collectionRef.borrowNFT(tokenId: id)!.metadata)
        }
      }

      return "hi"
}
`