<script setup lang="ts">
defineProps<{ qr?: boolean; imageTool?: boolean }>()
const { t } = useSiteLanguage()
</script>
<template>
  <div v-if="imageTool" class="tool-art image-art" aria-hidden="true"><div class="art-top"><span>TINY IMAGE</span><span class="art-arrow">↗</span></div><div class="image-frame"><svg viewBox="0 0 240 160" fill="none"><rect width="240" height="160" rx="8" fill="#f7f9fc"/><circle cx="173" cy="43" r="18" fill="#e4aa5c"/><path d="M0 160L77 54L153 160Z" fill="#779cb8"/><path d="M90 160L170 85L240 160Z" fill="#426a8a"/></svg><span>JPEG · PNG · WebP</span></div><div class="art-bottom">{{ t('COMPRESS / RESIZE / COMPARE') }}</div></div>
  <div v-else-if="qr" class="tool-art qr-art" aria-hidden="true"><div class="art-top"><span>TINY QR TOOLKIT</span><span class="art-arrow">↗</span></div><div class="qr-symbol"><span v-for="n in 3" :key="n" /><b>↗</b></div><div class="art-bottom">{{ t("CREATE / CUSTOMIZE / DECODE") }}</div></div>
  <div v-else class="tool-art" aria-hidden="true">
    <div class="art-top"><span class="art-monogram">t<span>t</span></span><span>TINY’S TOOL<br>{{ t("THE DEVELOPER TOOLBOX") }}</span><span class="art-arrow">↗</span></div>
    <div class="code-sheet"><div class="sheet-bar"><i /><i /><i /><span>something useful.json</span></div><div class="code-lines"><span class="line-number">01</span><span>{</span><span class="line-number">02</span><span>&nbsp; "less": <em>"friction"</em>,</span><span class="line-number">03</span><span>&nbsp; "more": <em>"making"</em></span><span class="line-number">04</span><span>}</span></div><div class="sheet-bottom"><span class="small-dot" /> {{ t("A LITTLE CLARITY GOES A LONG WAY") }}</div></div>
    <div class="art-bottom"><span>{{ t("FORMAT / VALIDATE / EXPLORE") }}</span><span class="braces">{ }</span></div>
  </div>
</template>
