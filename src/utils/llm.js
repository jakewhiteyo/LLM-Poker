import { queryApi } from "./api";
import { determineMinBet, handleBet, handleFold } from "./bet";
import { generatePrompt } from "./prompts";

const handleLLM = async (state, pushAnimationState) => {
  console.log("state", state);
  const currentPlayer = state.players[state.activePlayerIndex];
  const prompt = generatePrompt(state, currentPlayer);
  console.log("prompt", prompt);
  let response;
  switch (currentPlayer.name) {
    case "OpenAI GPT 3.5":
      response = await queryApi(prompt, "gpt");
      break;
    case "Meta LLama 3.1":
      response = await queryApi(prompt, "llama");
      break;
    case "Google Gemini":
      response = await queryApi(prompt, "gemini");
      break;
    case "Claude 3.5 Sonnet":
      response = await queryApi(prompt, "claude");
      break;
    default:
      throw new Error(`Unrecognized player: ${currentPlayer.name}`);
  }
  console.log("response", response);
  return handleResponse(response.data, state);
  // const testResponse =
  //   "Check -  You have a strong hand with Queen's and want to encourage other players to fold while also increasing the pot. ";
  // return handleResponse(testResponse, state);
};

const handleResponse = (response, state) => {
  const { highBet } = state;
  const activePlayer = state.players[state.activePlayerIndex];

  const min = determineMinBet(highBet, activePlayer.chips, activePlayer.bet);
  const max = activePlayer.chips + activePlayer.bet;

  const cleanedString = response.replace(/\{.*?\}/g, "");
  console.log("cleanedString", cleanedString);
  const [actionRaw, reason] = cleanedString.split("-");
  const action = actionRaw.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
  state.playActionMessages = [
    ...state.playActionMessages,
    {
      name: activePlayer.name,
      action: action,
      reason: reason,
    },
  ];
  if (action.startsWith("check")) {
    const betValue = state.minBet;
    return handleBet(state, betValue, min, max);
  } else if (action.startsWith("call")) {
    const betValue = state.minBet;
    return handleBet(state, betValue, min, max);
  } else if (action.startsWith("raise")) {
    const [actionType, amount] = action.split(" ");
    const parsedAmount = parseInt(amount);

    if (parsedAmount > state.minBet) {
      return handleBet(state, min + parsedAmount, min, max);
    } else {
      throw new Error(`Raise failed - issue with value - ${amount}`);
    }
  } else if (action.startsWith("fold")) {
    return handleFold(state);
  } else {
    throw new Error(
      `Received response:\n ${response}\n Dont recognize action - ${action}\n`
    );
  }
};

export { handleLLM };
