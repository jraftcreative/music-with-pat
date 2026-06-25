#import "../templates/worksheet-template.typ": worksheet, exercise, answer-key

#show: worksheet.with(
  title: "Rhythm Counting — Quarter Notes and Rests",
  subtitle: "Beginner Piano",
  level: "Beginner",
  instructions: [
    Count out loud while clapping each rhythm. Use "1, 2, 3, 4" for quarter
    notes and whisper "(rest)" for quarter rests. Then circle any rhythm
    you found tricky.
  ],
)

#exercise("1")[♩ ♩ ♩ ♩]
#exercise("2")[♩ ♩ 𝄽 ♩]
#exercise("3")[𝄽 ♩ ♩ ♩]
#exercise("4")[♩ 𝄽 ♩ 𝄽]
#exercise("5")[𝄽 𝄽 ♩ ♩]
#exercise("6")[♩ ♩ 𝄽 𝄽]
#exercise("7")[♩ 𝄽 𝄽 ♩]
#exercise("8")[𝄽 ♩ 𝄽 ♩]

#v(1em)
*Fill-in the bar line:* Draw a bar line after every 4 beats. (Each ♩ = 1 beat, each 𝄽 = 1 beat.)

#exercise("9")[♩ ♩ ♩ ♩ ♩ 𝄽 ♩ ♩ ♩ ♩ ♩ ♩]
#exercise("10")[𝄽 ♩ ♩ ♩ ♩ ♩ 𝄽 ♩]

#answer-key[
  Exercises 1–8: clap and count — no written answer.
  Exercise 9: ♩ ♩ ♩ ♩ *|* ♩ 𝄽 ♩ ♩ *|* ♩ ♩ ♩ ♩
  Exercise 10: 𝄽 ♩ ♩ ♩ *|* ♩ ♩ 𝄽 ♩
]
