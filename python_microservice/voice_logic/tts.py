import pyttsx3


def tts(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()
