Steps
- Build the Dictionary: 
  - parse corpus, create list of each word in a sentence, with the possible words that can immediately follow it.
  - Include full stops.
  - Make sure to include an empty node for the initial state to capture starting words.
  - Treat punctuated words as separate words (e.g. Joe vs. Joe's).
  - Assign each following word a probability based on the count after churning the corpus. 
- Generate a sentence:
  - Start from initial state, and keep going until a full stop. 
  - Add an increasing probability of the sentence ending at the next full stop based on length of sentence. Long sentences should be rare.