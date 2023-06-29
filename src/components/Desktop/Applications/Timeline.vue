<template>
  <div id="timeline" class="timeline-container">
    <div id="mytimeline" class="timeline-wrapper">
      <vue-horizontal-timeline class="vue-horizontal-timeline" :items="items" :theme="theme" mode="VERTICAL_ALTERNATING">
        <template #default="{ item }">
          <div class="timeline-item">
            <div class="timeline-content">
              <h3 class="timeline-title">{{ item.title }}</h3>
              <div class="timeline-card">
                <h4 class="card-title">{{ item.cardTitle }}</h4>
                <h5 class="card-subtitle">{{ item.cardSubtitle }}</h5>
                <p class="card-text">{{ item.cardDetailedText }}</p>
                <div class="card-media">
                  <template v-if="item.media.type === 'IMAGE'">
                    <img :src="item.media.source.url" alt="Timeline Image" />
                  </template>
                  <template v-if="item.media.type === 'VIDEO'">
                    <iframe :src="item.media.source.url" frameborder="0" allowfullscreen></iframe>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vue-horizontal-timeline>
    </div>
    <section class="timeline">
      <div class="timeline-line"></div>
    </section>
  </div>
</template>
<script>
import VueHorizontalTimeline from 'vue-horizontal-timeline';

import photo1 from '@/assets/timelinephotos/KV-Kolkata.png';
import photo2 from '@/assets/timelinephotos/KV2.jpg';
import photo3 from '@/assets/timelinephotos/KV1.jpg';
import photo4 from '@/assets/timelinephotos/KV1Grad.png';
import photo5 from '@/assets/timelinephotos/Amity_University,_Kolkata.jpg';
import photo6 from '@/assets/timelinephotos/Amity.jpg';
import photo7 from '@/assets/timelinephotos/Amiphoria.png';
import photo13 from '@/assets/photos/photo13.jpg';
import photo17 from '@/assets/photos/photo17.jpg';

export default {
  components: {
    VueHorizontalTimeline,
  },
  data() {
    return {
      photos: [
        photo1,
        photo2,
        photo3,
        photo4,
        photo5,
        photo6,
        photo13
      ],
      items: [
        {
          title: '2005',
          cardTitle: 'Kendriya Vidyalaya No.2, Salt Lake',
          cardSubtitle: 'Primary School',
          cardDetailedText:
            'I get into Kendriya Vidyalaya No.2, Salt Lake in 2005, to complete my primary schooling from the CBSE Board.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo1,
            },
          },
        },
        {
          title: '2011',
          cardTitle: 'Kendriya Vidyalaya No.2, Salt Lake',
          cardSubtitle: 'Mid School',
          cardDetailedText:
            'I reach my mid school after completing my primary schooling from Kendriya Vidyalaya No.2, Salt Lake and pursue subjects like Science, Maths, English, Hindi, P.E., History, Geography, Social Studies and Pol. Science.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo2,
            },
          },
        },
        {
          title: '2016',
          cardTitle: 'Kendriya Vidyalaya No.1, Salt Lake',
          cardSubtitle: 'High School',
          cardDetailedText:
            'I reach my high school after completing my mid schooling from Kendriya Vidyalaya No.2, Salt Lake and I join Kendriya Vidyalaya No.1, Salt Lake with Computer Science as my core subject.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo3,
            },
          },
        },
        {
          title: '2018',
          cardTitle: 'Kendriya Vidyalaya No.1, Salt Lake',
          cardSubtitle: 'High School',
          cardDetailedText: 'I complete my schooling from Kendriya Vidyalaya No.1, Salt Lake and start looking for college.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo4,
            },
          },
        },
        {
          title: '2018',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: 'Undergraduation',
          cardDetailedText:
            'I get into Amity University Kolkata, to pursue Bachelor\'s in Computer Applications with core subjects like C/C++, Java, Python, Data Structures and Algorithms, Image Processing, Mathematics and more.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo5,
            },
          },
        },
        {
          title: '2018',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: "Fresher's party 2018",
          cardDetailedText: 'We receive fresher\'s party from VH1 and Engage, spotlighting the Progressive Brothers. We have a blast.',
          media: {
            type: 'VIDEO',
            source: {
              url: 'https://www.youtube.com/embed/OaCQOybf6DM',
              type: 'mp4',
            },
          },
        },
        {
          title: '2020',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: 'Amiphoria 2020',
          cardDetailedText:
            'Our team Loathe performs songs like Wonderful Life by Bring Me The Horizon and Gustaakh by The Local Train in front of the entire Amity University and receive a huge response from the audience.',
          media: {
            type: 'VIDEO',
            source: {
              url: 'https://www.youtube.com/embed/3EmTaiHGMqk',
              type: 'mp4',
            },
          },
        },
        {
          title: '2021',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: 'Undergraduate',
          cardDetailedText: 'I completed my bachelor\'s degree from Amity University Kolkata, sharing loads of memories with my friends for life.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo13,
            },
          },
        },
        {
          title: '2021',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: 'Postgraduate',
          cardDetailedText: 'I get into Amity University Kolkata, to pursue Master\'s in Computer Applications with core subjects like Java, Artificial Intelligence, Data Structures and Algorithms, Computer Graphics, Machine Learning and more.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo6,
            },
          },
        },
        {
          title: '2022',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: 'Amiphoria',
          cardDetailedText: 'I volunteer in the biggest event of our university known as the Amiphoria. The sheer experience itself is one of the most amazing things in Amity University Kolkata.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo7,
            },
          },
        },
        {
          title: '2023',
          cardTitle: 'Amity University Kolkata',
          cardSubtitle: 'Postgraduate',
          cardDetailedText: 'I completed my mater\'s degree from Amity University Kolkata, sharing loads of memories with my friends for life.',
          media: {
            type: 'IMAGE',
            source: {
              url: photo17,
            },
          },
        },
      ],
      theme: {
        primary: '#bf360c',
        secondary: '#F57F17',
        cardBgColor: '#ff8a65',
        cardForeColor: '#dd2c00',
      },
    };
  },
};
</script>

<style>
/* Add your custom styles here */
.timeline-item {
  margin-bottom: 20px;
  width: 320px;
}

.timeline-content {
  background-color: #ffffff;
  padding: 5px;
  border-radius: 5px;
}

.timeline-title {
  font-size: 20px;
  margin-bottom: 5px;
}

.timeline-card {
  margin-top: 5px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 5px;
}

.card-subtitle {
  font-size: 14px;
  margin-bottom: 5px;
}

.card-text {
  font-size: 12px;
  margin-bottom: 5px;
}

.card-media img {
  max-width: 100%;
  max-height: 150px;
}

.card-media iframe {
  width: 100%;
  height: 100%;
  max-height: 150px;
  border: none;
}

.timeline-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Adjust the height as needed */
}

.timeline-wrapper {
  width: 100%;
  height: 100%;
  background-color: #0288d1;
  flex: 1;
}

.timeline {
  flex: 1;
  background-color: #0288d1;
  display: flex;
  align-items: center;
  position: relative;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 100%;
  background-color: #0288d1;
  z-index: 1;
}

.vue-horizontal-timeline{
  height: 100%;
}

#timeline {
  height: 100%;
}
</style>
