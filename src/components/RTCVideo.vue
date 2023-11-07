<template>
  <div class="rtc-video">
    <div class="local-video">
      <Video ref="localVideoRef"></Video>
    </div>
    <div class="remote-video">
      <Video ref="remoteVideoRef"></Video>
    </div>
    <RTCDataChannel v-show="showDataChannel" />
  </div>
  <div class="footer">
    <button className="audio btnItem">
      <TrackToggle
        source="microphone"
        :initialState="true"
        @onChange="onAudioChange"
      />
    </button>
    <button className="video btnItem">
      <TrackToggle
        source="camera"
        :initialState="true"
        @onChange="onVideoChange"
      />
    </button>
    <button className="message btnItem">
      <TrackToggle
        source="message"
        :initialState="true"
        @onChange="onMessageShow"
      />
    </button>
    <button className="leave btnItem">
      <TrackToggle source="leave" :initialState="true" @onChange="onLeave" />
    </button>
  </div>
</template>

<script setup>
import Video from "./Video.vue";
import { ref, onMounted } from "vue";
import RTCDataChannel from "./RTCDataChannel.vue";
import TrackToggle from "./TrackToggle.vue";

const emits = defineEmits(["streamSuccess", "leave"]);

const audioEnabled = ref(true);
const videoEnabled = ref(true);
const onAudioChange = (enabled) => {
  audioEnabled.value = enabled;
  initVideo(localVideoRef.value.$el, "refresh");
};
const onVideoChange = (enabled) => {
  videoEnabled.value = enabled;
  initVideo(localVideoRef.value.$el, "refresh");
};

const showDataChannel = ref(false);
const onMessageShow = () => (showDataChannel.value = !showDataChannel.value);
const onLeave = () => emits("leave");
const remoteVideoRef = ref(null);

const localVideoRef = ref(null);
onMounted(() => {
  initVideo(localVideoRef.value.$el);
});
// 初始化本地视频
const initVideo = async (video, type) => {
  if (!video) return;
  try {
    let config = {
      video: videoEnabled.value,
      audio: audioEnabled.value,
    };
    console.log(config);
    // userMediaConfig ,getDisplayMedia共享屏幕
    let stream = await navigator.mediaDevices.getUserMedia(config);
    console.log(stream);
    video.srcObject = stream; // 本机播放流
    emits("streamSuccess", { stream, remoteVideoRef, type });
    video.play();
  } catch (e) {
    console.log(`error: `, e);
  }
};
</script>

<style lang="scss" scoped>
.rtc-video {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 400px;
  padding: 0.6rem;
}
.local-video,
.remote-video {
  width: 500px;
  height: 100%;
  margin-right: 10px;
}
.remote-video {
  margin-right: 0;
}
.footer {
  height: 100px;
  margin-top: 15px;
}

.audio,
.video,
.btnItem {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  /* margin: 0 4px; */
  background-image: none;
  background-color: #1e1e1e;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  text-indent: 0px;
  text-shadow: none;
  outline: none;
}
.audio:hover,
.video:hover {
  background-color: #2b2b2b;
}
.leave {
  background-color: rgb(249, 31, 49);
}
.btnItem {
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
