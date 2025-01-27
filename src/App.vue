<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";

interface IChatMessage {
  text: string;
  sender: string;
  time: Date;
}

const chatMessage = ref("");
const chatMessages = ref<IChatMessage[]>([]);

const encryptionKey = import.meta.env.VITE_ENC_KEY;

// Encrypt and save chat history
const saveChatHistory = () => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(chatMessages.value),
    encryptionKey
  ).toString();
  localStorage.setItem("chatHistory", encrypted);
};

const formattedTime = (hours, minutes) =>
  `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

function insertMessage() {
  const message_req = chatMessage.value.trim();

  if (message_req.length) {
    chatMessages.value.push({
      text: message_req,
      sender: "user",
      time: new Date(),
    });
    chatMessage.value = "";

    axios
      .post("http://localhost:3000/api/query", {
        query: message_req,
      })
      .then(function (response) {
        chatMessages.value.push({
          text: response.data,
          sender: "bot",
          time: new Date(),
        });
        saveChatHistory();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

onBeforeMount(() => {
  try {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const decrypted = CryptoJS.AES.decrypt(savedMessages, encryptionKey).toString(
          CryptoJS.enc.Utf8
        );
        chatMessages.value = JSON.parse(decrypted);
      } catch (e) {
        console.error("Error decrypting chat history:", e);
      }
    }
  } catch (err) {}

  if(chatMessages.value.length == 0) {
    chatMessages.value.push({
      text:
        "Welcome! I can answer your medical research questions. Ask me anything about PubMed.",
      sender: "bot",
      time: new Date(),
    });
  }
});
</script>

<template>
  <main>
    <div class="full-viewport">
      <div class="chat-window glassmorphism">
        <div class="chat-title">
          <div class="chat-title-avatar">
            <img src="./assets/robot.jpg" alt="profile-picture" />
          </div>
          <div>
            <span class="chat-title-name">PubMedQA</span>
            <div class="chat-title-status">
              <div class="chat-title-status-circle"></div>
              <p class="chat-title-status-text">Active</p>
            </div>
          </div>
        </div>

        <div class="chat-messages" id="chat-messages">
          <div
            v-for="(message, index) in chatMessages"
            :key="'message-' + index"
            class="message"
            :class="{ 'message-personal': message.sender != 'bot' }"
          >
            <div class="bubble" :class="{ 'bubble-personal': message.sender != 'bot' }">
              <div class="bubble-text">
                {{ message.text }}
                <span class="sent-time">{{
                  formattedTime(new Date(message.time).getHours(), new Date(message.time).getMinutes())
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input
            autocomplete="off"
            type="text"
            id="message-input"
            placeholder="Send a message"
            v-model="chatMessage"
            @keydown.enter="insertMessage()"
          />
          <button id="send-button" @click="insertMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
