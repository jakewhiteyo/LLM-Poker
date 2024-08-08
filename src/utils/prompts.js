const generatePrompt = (state, player) => {
  let prompt = "You are in a poker game with the following conditions:";
  prompt += `\n- small blind: $10`;
  prompt += `\n- big blind: $20`;
  prompt += `\n- buy-in: $20,000`;
  prompt += `\nCurrent Game State:`;
  prompt += `\n- Your current Money: ${player.chips}`;
  prompt += `\n- Turn number ${state.turnNumber}`;
  prompt += `\n- Active Players: ${state.numPlayersActive}`;
  prompt += `\n- Current Pot: ${state.pot}`;
  prompt += `\nYour Hand:`;
  player.cards.forEach((card) => (prompt += `\n- ${phraseCard(card)}`));
  if (state.communityCards.length > 0) {
    prompt += `\nBoard Cards:`;
    state.communityCards.forEach(
      (card) => (prompt += `\n- ${phraseCard(card)}`)
    );
  } else {
    prompt += `\nThere are no cards currently on the board.`;
  }
  prompt += `\nCurrent Bet:`;
  prompt += `\n- ${state.minBet} to play`;
  prompt += `\nConsidering the current state of the game, would you like to call, fold, or raise?`;
  prompt += `\nPlease respond in the following format:`;
  prompt += `\n{action} - {1 sentence of justification}`;
  prompt += `\nFor Example:`;
  prompt += `\n- Check - Because I think {player_number} has a flush and im not confident in my hand`;
  prompt += `\n- Raise 20 - I have a strong hand and want to increase the pot`;

  console.log("prompt", prompt);
};

const phraseCard = (card) => {
  return `${card.cardFace} of ${card.suit}`;
};

export { generatePrompt };
