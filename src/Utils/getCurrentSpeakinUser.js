export const getUserWhoIsSpeaking = (participants) => {
    return participants?.filter((p) => p.micIsOn == true)
}