import speech_recognition as sr

# obtain audio from the microphone
r = sr.Recognizer()


def listen():
    with sr.Microphone() as source:
        print("Say something!")
        r.adjust_for_ambient_noise(source)

        while True:
            try:
                audio = r.listen(source)
                text = r.recognize_sphinx(audio)
                print("You said: " + text)
                return text
            except sr.WaitTimeoutError:
                print("Timeout; waiting for speech")


listen()
