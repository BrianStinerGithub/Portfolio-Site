class project:
    def __init__(self, name, description, codelink, livelink, image):
        self.title = name
        self.description = description
        self.codelink = codelink
        self.livelink = livelink
        self.image = image

projects = [
        project('CloudCure', 
        'Cloud Cure is a Web App which will allow a user to register as a nurse or a doctor, and provide patients with a medical diagnosis. \
        At Cloud Cure nurses will be able to login and fill out patient diagnosis forms. Doctors will be able to login and finalize patient diagnosis forms. \
        Afterwards a nurse/doctor will be able to print out the patient diagnosis form in order to provide continuous support for the patient.',
        'https://github.com/CloudCure/CloudCure',
        'https://example.com',
        'https://s3.amazonaws.com/utep-uploads/wp-content/uploads/DUQ-MIG/2018/09/19122843/nurse-using-a-tablet.jpg'),
        
        project('MyTube',
        'MyTube is a copy of YouTube, made with Django and CSS. It is a video sharing website. It allows users to upload videos, and search for videos by title, \
        description, or tags. Users can also like, dislike, and comment on videos. Users can also follow other users and see their videos.',
        'https://github.com/BrianStinerGithub/MyTube',
        '',
        ''),
        
        project('TikTok Compilation Channel Bot',
        'TikTok Compilation ChannelBot is a Python script that scrapes TikTok videos based on a keyword and compiles them into a video. \
        The videos are then uploaded to a YouTube channel and a thumbnail is generated for each video. The script can be run as often as you want.',
        'https://github.com/BrianStinerGithub/automated_youtube_channel',
        '',
        ''),]