<template>
  <div class="certificates">
    <!-- Thumbnail view -->
    <div v-if="!selectedCertificate" class="gallery">
      <img
        v-for="(certificate, index) in certificates"
        :key="index"
        :src="certificate"
        class="thumbnail"
        alt="Certificate Thumbnail"
        @click="selectPhoto(certificate)"
      />
    </div>

    <!-- Full certificate view -->
    <div v-else class="full-certificate-container">
      <div class="full-certificate-wrapper">
        <img :src="selectedCertificate" class="full-certificate" alt="Selected Certificate" />
        <button @click="goBack" class="back-button">
          &#8592; <!-- UTF-8 arrow character for left arrow -->
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import cert1 from '@/assets/cetificates/Advanced Analytics with Amazon SageMaker.png'
import cert2 from '@/assets/cetificates/Amazon Neptune Service Primer.png'
import cert3 from '@/assets/cetificates/Anomaly Detection on AWS.png'
import cert4 from '@/assets/cetificates/Automatic Model Tuning in Amazon SageMaker.png'
import cert5 from '@/assets/cetificates/AvishakeAdhikary_course_Course-Excellence-1638932347900.png'
import cert6 from '@/assets/cetificates/AWS Database Offerings.png'
import cert7 from '@/assets/cetificates/AWS DeepRacer_ Driven by Reinforcement Learning.png'
import cert8 from '@/assets/cetificates/AWS Development Tools Services Overview.png'
import cert9 from '@/assets/cetificates/Building Recommendation Systems with MXNet and GluOn.png'
import cert10 from '@/assets/cetificates/Coursera AWS Computer Vision_ Getting Started with T5Z5ARFKC8K3.png'
import cert11 from '@/assets/cetificates/Coursera Building Conversational Experiences with Dialogflow JELD8JWZY2YZ.png'
import cert12 from '@/assets/cetificates/Coursera COVID-19 Contact Tracing USXUPG8KQXNT.png'
import cert13 from '@/assets/cetificates/Coursera Google Cloud Platform Fundamentals for AWS Professionals 56UKHX5LSW76.png'
import cert14 from '@/assets/cetificates/Coursera Introduction to Cloud Identity CGTZULWGM5BN.png'
import cert15 from '@/assets/cetificates/Coursera Introduction to Programming with MATLAB 3WQZT853989R.png'
import cert16 from '@/assets/cetificates/Developing Machine Learning Applications.png'
import cert17 from '@/assets/cetificates/Exam Readiness_ AWS Certified Machine Learning - Specialty.png'
import cert18 from '@/assets/cetificates/Google Ads Display Certification.png'
import cert19 from '@/assets/cetificates/Google My Business Basics Certification.png'
import cert20 from '@/assets/cetificates/ICMCSI2020 Certificate.jpg'
import cert21 from '@/assets/cetificates/Introduction to Amazon Elastic Compute Cloud (EC2).png'
import cert22 from '@/assets/cetificates/Introduction to Amazon SageMaker Neo.png'
import cert23 from '@/assets/cetificates/Introduction to Amazon SageMaker.png'
import cert24 from '@/assets/cetificates/Introduction-to-Flutter-Development-App-Brewery.png'
import cert25 from '@/assets/cetificates/IOT Foundation Telementary AWS.png'
import cert26 from '@/assets/cetificates/Machine Learning Algorithms Explained.png'
import cert27 from '@/assets/cetificates/SoloLearn C Tutorial Certificate.png'
import cert28 from '@/assets/cetificates/SoloLearn CSharp Fundamentals Certificate.png'
import cert29 from '@/assets/cetificates/SoloLearn C++ Tutorial Certificate.png'
import cert30 from '@/assets/cetificates/SoloLearn CSS Fundamentals Certificate.png'
import cert31 from '@/assets/cetificates/SoloLearn HTML Certificate.png'
import cert32 from '@/assets/cetificates/SoloLearn Java Tutorial Certificate.png'
import cert33 from '@/assets/cetificates/SoloLearn JavaScript Tutorial Certificate.png'
import cert34 from '@/assets/cetificates/SoloLearn PHP Tutorial Certificate.png'
import cert35 from '@/assets/cetificates/SoloLearn Python 3 Tutorial Certificate.png'
import cert36 from '@/assets/cetificates/SoloLearn React + Redux Certificate.png'
import cert37 from '@/assets/cetificates/SoloLearn Ruby Tutorial Certificate.png'
import cert38 from '@/assets/cetificates/SoloLearn SQL Fundamentals Certificate.png'
import cert39 from '@/assets/cetificates/SoloLearn Swift 4 Fundamentals Certificate.png'


export default {
  name: 'Certificates',
  data() {
    return {
      certificates: [
        cert1,
        cert2,
        cert3,
        cert4,
        cert5,
        cert6,
        cert7,
        cert8,
        cert9,
        cert10,
        cert11,
        cert12,
        cert13,
        cert14,
        cert15,
        cert16,
        cert17,
        cert18,
        cert19,
        cert20,
        cert21,
        cert22,
        cert23,
        cert24,
        cert25,
        cert26,
        cert27,
        cert28,
        cert29,
        cert30,
        cert31,
        cert32,
        cert33,
        cert34,
        cert35,
        cert36,
        cert37,
        cert38,
        cert39,
      ],
      selectedCertificate: null,
    };
  },
  methods: {
    selectPhoto(certificate) {
      this.selectedCertificate = certificate;
    },
    goBack() {
      this.selectedCertificate = null;
    },
  },
};
</script>

<style scoped>
.gallery {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: 100%;
}

.thumbnail {
  min-width: 100px;
  min-height: 100px;
  max-width: 800px;
  max-height: 800px;
  width: 150px;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
  margin: 10px;
}

.full-certificate-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: auto;
}

.full-certificate-wrapper {
  position: relative;
  max-width: 100%;
  max-height: calc(100vh - 100px);
}

.full-certificate {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: black;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 50%;
}
</style>
