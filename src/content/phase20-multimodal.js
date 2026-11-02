// Phase 20: Multimodal Generative AI (NCA-GENM)
// Builds on Phase 6 (diffusion, multimodal intro) and Phase 16 (vision-and-multimodal, generative-architectures).
export default {
  id: 'multimodal',
  number: 20,
  title: 'Multimodal Generative AI (NCA-GENM)',
  titleSi: 'Multimodal Generative AI: text, image, audio, video එකට තේරුම් ගන්න සහ හදන්න AI',
  summary: 'මේ phase එකේදී අපි text විතරක් නෙවෙයි, images, audio, video, 3D සහ sensor data එක්කත් වැඩ කරන AI ගැඹුරින් ඉගෙන ගන්නවා. හැම modality එකක්ම tokens බවට හරවන හැටි, CLIP සහ VLM වගේ architectures, loss functions, U-Net, text-to-image pipeline එක, speech, video, multimodal RAG, NeMo සහ Triton, evaluation සහ ethics මෙතන තියෙනවා. NVIDIA NCA-GENM exam එකේ හැම කොටසක්ම මේ phase එකෙන් cover වෙනවා. Phase 6 සහ Phase 16 වල CLIP, ViT, diffusion ගැන කියපු දේවල් උඩ අපි ගොඩනඟනවා.',
  duration: 'සති 4-6',
  topics: [
    // 1
    {
      id: 'what-is-multimodal',
      title: 'Multimodal කියන්නේ මොකක්ද? Modality වර්ග',
      body: [
        'Modality කියන්නේ තොරතුරු එන "වර්ගය" හෝ "channel" එක. Text එක modality එකක්. Image එක තව එකක්. Audio, video, 3D, sensor data කියන්නේත් modalities. Multimodal AI කියන්නේ මේ වර්ග දෙකක් හෝ වැඩි ගණනක් එකට තේරුම් ගන්න, නැත්නම් එකකින් අනිකක් හදන්න පුළුවන් AI එකක්.',
        'ප්‍රධාන modalities මෙන්න: Text (වචන, code). Image (photos, scans, diagrams). Audio (කතාව, සංගීතය, ශබ්ද). Video (කාලයත් එක්ක වෙනස් වෙන images පෙළක්, බොහෝ විට audio එකත් එක්ක). 3D (point clouds, meshes, depth maps). Sensor data (LiDAR, radar, IMU, temperature, GPS, ECG වගේ time-series). Self-driving car එකක camera, LiDAR, radar තුනම එකට පාවිච්චි කරනවා. ඒක multimodal system එකක්.',
        'Multimodal වැඩ දෙවර්ගයක් තියෙනවා. Understanding: image එකක් බලලා ප්‍රශ්නයකට text උත්තරයක් දෙන එක (VQA, captioning). Generation: text එකකින් image, audio, video හදන එක (text-to-image, TTS). සමහර අලුත් models දෙකම කරනවා. මේ phase එකේ "Generative AI Multimodal" කියන්නේ මේ දෙකටම.',
        'ඇයි මේක අමාරු? Modalities හැම එකකම හැඩය (shape) වෙනස්. Text එක tokens පෙළක්. Image එක pixels grid එකක්. Audio එක තත්පරයකට samples දහස් ගණනක්. ලොකුම අභියෝගය තමයි මේ හැම එකක්ම එකම "භාෂාවකට", ඒ කියන්නේ vectors (embeddings) වලට හරවලා, එකිනෙකට සම්බන්ධ කරන එක. මේකට alignment කියනවා.',
      ],
      analogy: 'ඔයා Pettah market එකේ කඩේකට යනවා කියලා හිතන්න. කඩේ මුදලාලි ඔයාගේ වචන අහනවා (audio). ඔයා අතින් පෙන්නන බඩුව බලනවා (image). තරාදියේ බර කියවනවා (sensor). මේ හැම එකක්ම එකට එකතු කරලා තමයි "මේ අල කිලෝ එකක් Rs. 350යි" කියලා තීරණය කරන්නේ. ඒ මුදලාලි multimodal.',
      example: 'Phone එකේ Google Lens වගේ app එකකින් කොළ වලට ලෙඩක් හැදුණු තේ පැළයක photo එකක් අරන් සිංහලෙන් "මේකට මොකද වෙලා තියෙන්නේ?" කියලා අහනවා. Input modalities 2ක්: image + text (හෝ voice නම් audio). Output: text උත්තරයක්, සමහරවිට TTS එකෙන් කටහඬක්. එකම ප්‍රශ්නයට modalities 3ක් සම්බන්ධ වෙනවා.',
      keyPoints: [
        'Modality = data වර්ගය: text, image, audio, video, 3D, sensor.',
        'Multimodal AI = modalities දෙකක් හෝ වැඩි ගණනක් එකට පාවිච්චි කරන AI.',
        'Understanding (image → text) සහ generation (text → image/audio/video) දෙකම multimodal.',
        'ලොකුම අභියෝගය = වෙනස් හැඩ තියෙන data එකම embedding space එකකට align කරන එක.',
      ],
      terms: [
        { en: 'Modality', si: 'Data එන වර්ගය හෝ channel එක (text, image, audio, video, 3D, sensor).' },
        { en: 'Cross-modal', si: 'එක modality එකකින් තව එකකට යන වැඩ. උදා: text වලින් image search කරන එක.' },
        { en: 'Point Cloud', si: '3D අවකාශයේ (x, y, z) points ගොඩක්. LiDAR sensors මේවා දෙනවා.' },
        { en: 'Sensor Fusion', si: 'Camera, LiDAR, radar වගේ sensors කිහිපයක data එකට එකතු කරන එක.' },
        { en: 'VQA (Visual Question Answering)', si: 'Image එකක් ගැන අහන ප්‍රශ්නයකට text උත්තරයක් දෙන එක.' },
        { en: 'Alignment (multimodal)', si: 'එකම අර්ථය තියෙන image එකයි text එකයි embedding space එකේ ළඟින් තියන එක.' },
      ],
    },
    // 2
    {
      id: 'modality-to-tokens',
      title: 'හැම Modality එකක්ම Tokens සහ Embeddings වලට හරවන හැටි',
      body: [
        'Transformer එකකට තේරෙන්නේ vectors පෙළක් (tokens) විතරයි. ඉතින් හැම modality එකක්ම මුලින්ම tokens පෙළක් කරන්න ඕනේ. Text වලට tokenizer එකක් තියෙනවා (Phase 4/5). Images වලට Phase 16 එකේ ඉගෙන ගත්ත ViT ක්‍රමය: image එක 16×16 patches වලට කපලා, හැම patch එකක්ම flatten කරලා linear projection එකකින් vector එකක් කරනවා, position embeddings එකතු කරනවා. 224×224 image එකකට patch tokens 196යි.',
        'Audio වලට ක්‍රම දෙකක් තියෙනවා. පළමු ක්‍රමය: waveform එක spectrogram එකක් කරන එක. Spectrogram එක කියන්නේ කාලය (x අක්ෂය) සහ සංඛ්‍යාතය (frequency, y අක්ෂය) තියෙන "රූපයක්". මිනිස් කනට ගැළපෙන විදිහට frequency scale එක වෙනස් කළාම ඒක log-Mel spectrogram එකක්. Whisper කරන්නේ audio එක 16 kHz වලට resample කරලා, තත්පර 30 කොටස් log-Mel spectrogram කරලා, ඒක encoder එකට දෙන එක. දෙවෙනි ක්‍රමය: neural audio codec එකකින් (උදා: Meta ගේ EnCodec) audio එක discrete tokens පෙළක් කරන එක. එතකොට LLM එකක් text tokens predict කරනවා වගේම audio tokens predict කරන්න පුළුවන්. MusicGen වගේ models මේ විදිහට වැඩ කරනවා.',
        'Video කියන්නේ frames පෙළක්. සරලම ක්‍රමය: තත්පරයකට frames කිහිපයක් (උදා: 1-2 fps) sample කරලා, හැම frame එකක්ම image විදිහට encode කරන එක. වඩා හොඳ ක්‍රමය: කාලය සහ අවකාශය දෙකම එකට කපන "tubelets" හෝ spacetime patches (උදා: frames 2 × 16 × 16 pixels කුට්ටියක්). Video tokens ගණන ඉක්මනින් අතිවිශාල වෙනවා, ඒ නිසා video VAE එකකින් මුලින් compress කරනවා.',
        '3D data වලට point clouds කුඩා කණ්ඩායම් (groups) වලට බෙදලා, හැම කණ්ඩායමක්ම token එකක් කරනවා. Depth maps image වගේම patches කරන්න පුළුවන්. Sensor time-series (IMU, ECG) කාල කොටස් (windows) වලට කපලා, හැම window එකක්ම token එකක් කරනවා. පොදු රටාව: "කපන්න → vector කරන්න → position දාන්න".',
      ],
      analogy: 'ලෝකයේ හැම රටකම මුදල් වෙනස්: Rs., $, ¥. Colombo airport එකේ money exchange එකකින් හැම මුදලක්ම එකම මුදලකට මාරු කළාම, ඔයාට ඒවා එකට එකතු කරන්න පුළුවන්. Patch embedding, spectrogram, audio codec කියන්නේ ඒ exchange counter. හැම modality එකක්ම "tokens" කියන එකම මුදලට මාරු කරනවා.',
      example: 'Bus එකක තත්පර 10 voice note එකක්: 16 kHz නම් samples 160,000යි. Whisper style log-Mel එකේ (10 ms hop) තත්පරයකට frames 100යි, ඒ කියන්නේ frames 1,000ක් × Mel bins 80ක්. Encoder එක ඒක තවත් දෙගුණයකින් අඩු කරලා vectors 500කට හරවනවා. Video: තත්පර 60ක clip එකක් 2 fps වලින් sample කරාම frames 120යි. Frame එකකට tokens 196 නම් 120 × 196 = tokens 23,520ක්. ඒ නිසයි video compress කරන්න ඕනේ.',
      keyPoints: [
        'Image → patches → linear projection → + position = tokens (ViT).',
        'Audio → log-Mel spectrogram (Whisper) හෝ neural codec tokens (EnCodec).',
        'Video → frames sample කරනවා හෝ spacetime patches (tubelets). Tokens ගොඩක් නිසා compression ඕනේ.',
        '3D / sensor → groups හෝ time windows → tokens.',
      ],
      terms: [
        { en: 'Spectrogram', si: 'කාලය සහ frequency අනුව ශබ්දයේ ශක්තිය පෙන්නන රූපය.' },
        { en: 'Log-Mel Spectrogram', si: 'මිනිස් කනට ගැළපෙන Mel scale එකට හරවලා log ගත්ත spectrogram එක. ASR models වල input එක.' },
        { en: 'Sample Rate', si: 'තත්පරයකට audio samples ගණන. Speech models වලට බොහෝ විට 16 kHz.' },
        { en: 'Neural Audio Codec', si: 'Audio එක discrete tokens වලට compress කරලා ආයේ waveform එකක් කරන network එක (EnCodec, SoundStream).' },
        { en: 'Tubelet / Spacetime Patch', si: 'Video එකේ frames කිහිපයක් හරහා යන 3D patch එකක්.' },
        { en: 'Frame Sampling', si: 'Video එකකින් සමහර frames විතරක් තෝරාගන්න එක (උදා: 1 fps).' },
      ],
    },
    // 3
    {
      id: 'multimodal-architectures',
      title: 'Multimodal Architectures: Dual Encoders, Fusion සහ VLMs',
      body: [
        'Dual encoder (two-tower) architecture එකේ image එකට encoder එකක්, text එකට වෙනම encoder එකක් තියෙනවා. දෙකේම output එකම embedding space එකේ vectors. CLIP මේ වර්ගයේ. වාසිය: images සියල්ල කලින්ම embed කරලා vector database එකක තියාගන්න පුළුවන්, search ගොඩක් වේගවත්. අවාසිය: image එකයි text එකයි "ගැඹුරින්" කතා කරන්නේ නෑ, අන්තිමේ cosine similarity එකකින් විතරයි සසඳන්නේ.',
        'Fusion කියන්නේ modalities එකට මිශ්‍ර කරන තැන. Early fusion: input එකේදීම tokens එකට එකතු කරලා එකම transformer එකකට දෙනවා (image tokens + text tokens එකම sequence එකක). Late fusion: හැම modality එකක්ම වෙන වෙනම සම්පූර්ණයෙන් process කරලා, අන්තිමේ outputs (scores හෝ vectors) එකතු කරනවා. සරලයි, ඒත් modalities අතර සියුම් සම්බන්ධතා මඟ හැරෙනවා. Cross-attention fusion: එක modality එකක queries, අනිත් modality එකේ keys සහ values බලනවා. Stable Diffusion U-Net එක text එක බලන්නේ cross-attention වලින්. Flamingo වගේ VLMs LLM layers අතරට cross-attention layers දානවා.',
        'අද ජනප්‍රියම VLM රටාව LLaVA-style: (1) Vision encoder (බොහෝ විට CLIP ViT) image එක patch features කරනවා. (2) Projector එකක් (linear layer එකක් හෝ පොඩි MLP එකක්) ඒ features LLM එකේ token embedding size එකට map කරනවා. (3) ඒ "visual tokens" text tokens එක්ක එකම sequence එකට දාලා LLM එකට දෙනවා. LLM එක ඒවා සාමාන්‍ය වචන වගේ attend කරනවා. මේක early fusion වර්ගයක්.',
        'කොයි එකද තෝරන්නේ? Retrieval/search නම් dual encoder (වේගවත්, index කරන්න පුළුවන්). ප්‍රශ්න උත්තර, reasoning, OCR නම් VLM (fusion ගැඹුරුයි). Generation වලදී text එක condition එකක් විදිහට දෙන්න cross-attention.',
      ],
      analogy: 'Dual encoder = විවාහ යෝජනා වෙබ් අඩවියක්. හැම කෙනෙක්ම වෙන වෙනම profile එකක් ලියනවා, system එක profile දෙකක් කොච්චර ගැළපෙනවද කියලා score එකක් දෙනවා. Late fusion = දෙන්නා වෙන වෙනම interview කරලා අන්තිමේ ලකුණු එකතු කරනවා. Early fusion / cross-attention = දෙන්නා එකම මේසේ වාඩි වෙලා ගැඹුරින් කතා කරනවා. ගැළපීම ගැන හොඳම තීරණය එන්නේ අන්තිම එකෙන්, ඒත් ඒකට වැඩි කාලයක් යනවා.',
      example: 'Product images 1,000,000ක් තියෙන online shop එකක් (Daraz වගේ). Customer "red saree with gold border" කියලා search කරනවා. Dual encoder: images මිලියනයම කලින් embed කරලා තියෙන නිසා query එක embed කරලා nearest neighbors හොයන්න milliseconds කිහිපයයි. VLM එකකට images මිලියනයම එකින් එක පෙන්නන්න ගියොත් පැය ගණන් යනවා. ඉතින් හොඳ රටාව: dual encoder එකෙන් top-50 ගන්නවා, ඊට පස්සේ VLM එකෙන් හෝ reranker එකෙන් ඒ 50 හොඳින් පෙළගස්වනවා.',
      keyPoints: [
        'Dual encoder (CLIP) = වෙන වෙනම encoders, එකම space එක, search වලට වේගවත්.',
        'Early fusion = tokens එකට එකම model එකකට. Late fusion = outputs අන්තිමේ එකතු කරනවා.',
        'Cross-attention = එක modality එකක queries, අනිකේ keys/values. Diffusion text conditioning මේකෙන්.',
        'LLaVA-style VLM = vision encoder → projector → LLM.',
      ],
      terms: [
        { en: 'Dual Encoder (Two-Tower)', si: 'Modality එකකට encoder එක බැගින්, outputs එකම embedding space එකේ.' },
        { en: 'Early Fusion', si: 'Input මට්ටමේදීම modalities එකට එකතු කරන එක.' },
        { en: 'Late Fusion', si: 'වෙන වෙනම process කරලා අවසාන outputs එකතු කරන එක.' },
        { en: 'Cross-Attention', si: 'එක sequence එකක queries වෙනත් sequence එකක keys සහ values වලට attend කරන attention.' },
        { en: 'LLaVA', si: 'CLIP vision encoder + projector + LLM (Vicuna/Llama) සම්බන්ධ කළ open VLM එකක්.' },
        { en: 'Visual Tokens', si: 'Projector එකෙන් LLM embedding space එකට ආපු image features.' },
      ],
    },
    // 4
    {
      id: 'multimodal-loss-functions',
      title: 'Multimodal Loss Functions: InfoNCE, ITM, Captioning, Reconstruction, Diffusion, KL',
      body: [
        'Loss function එක කියන්නේ model එකට "ඔයා කොච්චර වැරදිද" කියලා කියන අංකය. Multimodal models වලට වැඩේ අනුව වෙනස් losses තියෙනවා. Contrastive loss (InfoNCE): CLIP මේක පාවිච්චි කරනවා (Phase 16 බලන්න). Batch එකේ image-text pairs N තියෙනවා නම් N × N similarity table එකක් හදනවා. හරි pair එක (diagonal එක) ඉහළ score එකක් ගන්න ඕනේ, අනිත් N − 1 "negatives" අඩු score. ඇත්තටම මේක classification එකක්: "මේ image එකට N captions අතරින් හරි එක කොයිද?" ඒකට cross-entropy. Image → text සහ text → image දෙපැත්තටම කරලා average කරනවා (symmetric).',
        'Image-Text Matching (ITM) loss: fusion model එකකට image එකයි text එකයි එකට දීලා "ගැළපෙනවද නැද්ද?" කියලා yes/no (binary) classification එකක්. Model එකට අමාරු "hard negatives" (ගොඩක් සමාන ඒත් වැරදි captions) දුන්නාම හොඳට ඉගෙන ගන්නවා. Captioning / language modeling loss: image එක බලලා caption එකේ ඊළඟ token එක predict කරන cross-entropy. VLMs train කරන්නේ මේකෙන්. BLIP වගේ models contrastive + ITM + captioning තුනම එකට පාවිච්චි කරනවා.',
        'Reconstruction loss: autoencoder එකක් input එක ආයේ හදනකොට, මුල් එකයි හදපු එකයි අතර වෙනස. Pixels වලට MSE (වෙනසේ වර්ගයේ සාමාන්‍යය) හෝ L1 (absolute වෙනස). Images වඩා තියුණු වෙන්න perceptual loss (VGG features වල වෙනස) සහ adversarial loss (GAN discriminator එකක්) එකතු කරනවා. Stable Diffusion එකේ VAE train කරලා තියෙන්නේ මෙහෙම mix එකකින්.',
        'Diffusion noise-prediction loss: noisy image එකට එකතු කරපු ඇත්ත noise එකයි, model එක predict කරපු noise එකයි අතර MSE. සරලම විදිහට "noise එක හරියට අනුමාන කරන්න". KL divergence (VAE): encoder එක දෙන latent distribution එක standard normal එකක් (සාමාන්‍යය 0, විචලනය 1) කිට්ටුවට තියාගන්න දඬුවමක්. ඒ නිසා latent space එක smooth වෙනවා. VAE loss = reconstruction + KL (Phase 16 එකේ ELBO).',
      ],
      analogy: 'Wedding එකක photos 32ක් සහ names 32ක් මේසේ තියෙනවා. Contrastive = හැම photo එකටම හරි name එක ගළපන game එක. ITM = එක photo එකක් සහ එක name එකක් පෙන්නලා "හරිද වැරදිද?" අහන එක. Captioning = photo එක බලලා "මේ මනමාලියගේ නැන්දා" කියලා වාක්‍යය ලියන එක. Reconstruction = photo එක මතකයෙන් ආයේ අඳින එක. Diffusion loss = දූවිලි වැදුණු photo එකේ "දූවිලි මොනවද" කියලා හරියට හොයන එක.',
      example: 'Batch එකේ pairs 4යි: (kottu photo, "kottu"), (tuk-tuk, "tuk-tuk"), (අලියා, "elephant"), (තේ, "tea"). Kottu photo එකේ similarities: kottu 0.9, tuk-tuk 0.1, elephant 0.05, tea 0.2. Temperature එකෙන් scale කරලා softmax කරාම "kottu" එකට probability එක ගොඩක් වැඩියි. Loss = −log(ඒ probability එක). Probability 0.9 නම් loss ≈ 0.105. 0.3 නම් loss ≈ 1.20. වැරදි නම් loss ලොකුයි. Diffusion: ඇත්ත noise අගය 0.5, model එක කිව්වේ 0.3. MSE = (0.5 − 0.3)² = 0.04.',
      code: {
        lang: 'python',
        src: `# Hugging Face CLIP වලින් image එකක් captions 3කට කොච්චර ගැළපෙනවද බලමු
import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

name = "openai/clip-vit-base-patch32"
model = CLIPModel.from_pretrained(name)
proc = CLIPProcessor.from_pretrained(name)

image = Image.open("kottu.jpg")  # ඔයාගේ photo එක
texts = ["a plate of kottu roti", "a cricket match", "a tuk-tuk"]
inputs = proc(text=texts, images=image, return_tensors="pt", padding=True)
with torch.no_grad():
    out = model(**inputs)
# logits_per_image = scaled cosine similarity. softmax කරාම probability
probs = out.logits_per_image.softmax(dim=-1)[0]
print({t: round(p, 3) for t, p in zip(texts, probs.tolist())})`,
      },
      keyPoints: [
        'Contrastive / InfoNCE (CLIP) = N×N table, හරි pair එකට cross-entropy, දෙපැත්තටම.',
        'ITM = ගැළපෙනවද නැද්ද binary classification, hard negatives එක්ක.',
        'Captioning loss = ඊළඟ token එකට cross-entropy (VLMs).',
        'Reconstruction (MSE/L1 + perceptual) autoencoders වලට. Diffusion = predicted noise vs ඇත්ත noise MSE.',
        'VAE = reconstruction + KL (latent එක normal distribution එකට ළං කරන්න).',
      ],
      terms: [
        { en: 'InfoNCE', si: 'එක positive එකක් negatives ගොඩක් අතරින් හඳුනාගන්න cross-entropy contrastive loss එක.' },
        { en: 'Hard Negatives', si: 'හරි එකට ගොඩක් සමාන, ඒත් වැරදි examples. Model එකට අමාරුම ඒවා.' },
        { en: 'ITM (Image-Text Matching)', si: 'Image-text pair එකක් ගැළපෙනවද කියන binary classification loss එක.' },
        { en: 'Perceptual Loss', si: 'Pixels වෙනුවට pretrained network එකක features වල වෙනස මනින loss එක.' },
        { en: 'MSE (Mean Squared Error)', si: 'වෙනස වර්ග කරලා සාමාන්‍යය ගන්න loss එක.' },
        { en: 'KL Divergence', si: 'Distributions දෙකක් කොච්චර වෙනස්ද කියන මිනුම. VAE latent එක regularize කරනවා.' },
      ],
    },
    // 5
    {
      id: 'training-stability',
      title: 'Training Stability: Warmup, Normalization, Gradient Clipping, Mixed Precision, Residuals',
      body: [
        'ලොකු multimodal models train කරද්දී loss එක හදිසියේම ඉහළ යනවා (spike), නැත්නම් NaN (අංකයක් නොවන අගයක්) වෙනවා. Training stability කියන්නේ මේවා වළක්වන උපක්‍රම. Learning rate warmup: training එකේ මුල් steps කිහිපය (උදා: 1,000-2,000) learning rate එක 0 ඉඳන් ටිකෙන් ටික target අගයට වැඩි කරනවා. මුලදී weights random, Adam optimizer එකේ ඇතුළත statistics තවම විශ්වාස කරන්න බෑ. ඒ වෙලාවේ ලොකු පියවර තිබ්බොත් model එක නරක තැනකට පනිනවා.',
        'Normalization: LayerNorm, RMSNorm, GroupNorm වගේ layers activations වල පරාසය (scale) ස්ථාවරව තියනවා. Transformers වල LayerNorm/RMSNorm. Diffusion U-Nets වල GroupNorm (batch size පොඩි වුණත් වැඩ කරන නිසා). Gradient clipping: gradients වල මුළු දිග (global norm) සීමාවකට (උදා: 1.0) වඩා වැඩි නම් ඒක ඒ සීමාවට scale down කරනවා. එක නරක batch එකකින් weights විනාශ වෙන එක නවත්වනවා.',
        'Mixed precision: ගණනය කිරීම් වැඩි හරියක් FP16 හෝ BF16 (bits 16) වලින් කරලා, master weights FP32 වලින් තියාගන්නවා. Tensor Cores නිසා වේගය ගොඩක් වැඩියි, memory අඩුයි. FP16 වල පරාසය පොඩි නිසා පොඩි gradients 0 වෙනවා (underflow), ඒ නිසා loss scaling ඕනේ. BF16 වල පරාසය FP32 වගේම නිසා බොහෝ විට loss scaling ඕනේ නෑ. Ampere (A100) සහ අලුත් GPUs වල BF16 support තියෙනවා.',
        'Residual (skip) connections: layer එකක output එක = input + layer(input). ඇයි මේක උදව් වෙන්නේ? (1) Backpropagation වලදී gradient එකට "කෙටි පාරක්" ලැබෙනවා, layers සිය ගණනක් හරහා ගියත් gradient එක නැති වෙන්නේ නෑ (vanishing gradient විසඳුම). (2) Layer එකකට ඉගෙන ගන්න තියෙන්නේ "වෙනස" විතරයි, ඒ නිසා අලුත් layer එකක් මුලදී input එක නොවෙනස්ව යවනවා වගේ. (3) Loss surface එක smooth වෙනවා. ResNet, Transformers, U-Net හැම එකකම residuals තියෙනවා.',
      ],
      analogy: 'Warmup = උදේ cricket match එකට කලින් bowler කෙනෙක් හෙමින් warm-up කරනවා, පළමු ball එකෙන්ම 140 km/h දාන්නේ නෑ. Gradient clipping = tuk-tuk එකක speed governor එකක්, කොච්චර පාගත්තත් සීමාවට වඩා යන්නේ නෑ. Residual connection = ගමේ ඉඳන් Colombo යන්න highway එකක්. පොඩි පාරවල් (layers) වලින් යන්න පුළුවන්, ඒත් highway එක නිසා පණිවිඩය (gradient) කවදාවත් අතරමං වෙන්නේ නෑ.',
      example: 'Peak learning rate එක 0.0003, warmup steps 1,000යි. Step 100 දී LR = 0.0003 × 100/1000 = 0.00003. Step 500 දී 0.00015. Step 1,000 දී 0.0003. Gradient clipping: gradients වල global norm එක 8.0යි, max_norm 1.0යි. හැම gradient එකක්ම 1/8 = 0.125 න් ගුණ කරනවා. දිශාව එකමයි, දිග විතරක් අඩු ව�ෙනවා. Mixed precision: 1B parameter model එකක weights FP32 නම් 4 GB, BF16 නම් 2 GB.',
      keyPoints: [
        'Warmup = මුල් steps වල LR එක ටිකෙන් ටික වැඩි කරනවා, මුල් අස්ථාවරත්වය වළක්වනවා.',
        'Normalization (LayerNorm/RMSNorm/GroupNorm) = activations ස්ථාවරව තියනවා.',
        'Gradient clipping = gradient norm එකට සීමාවක්, loss spikes වළක්වනවා.',
        'Mixed precision = FP16/BF16 වේගය + FP32 master weights. FP16 ට loss scaling ඕනේ.',
        'Residual = x + f(x). Gradients වලට කෙටි පාරක්, ගැඹුරු networks train කරන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Learning Rate Warmup', si: 'Training මුලදී learning rate එක කුඩා අගයක ඉඳන් ටිකෙන් ටික වැඩි කරන එක.' },
        { en: 'Gradient Clipping', si: 'Gradient norm එක සීමාවකට වඩා වැඩි නම් scale down කරන එක.' },
        { en: 'Mixed Precision (AMP)', si: 'FP16/BF16 සහ FP32 එකට පාවිච්චි කරලා වේගයෙන්, අඩු memory එකකින් train කරන එක.' },
        { en: 'Loss Scaling', si: 'FP16 underflow වළක්වන්න loss එක ලොකු අංකයකින් ගුණ කරලා පස්සේ බෙදන එක.' },
        { en: 'BF16', si: 'FP32 වගේම පරාසයක් තියෙන, precision අඩු 16-bit format එක.' },
        { en: 'Residual Connection', si: 'Layer එකේ input එක output එකට කෙලින්ම එකතු කරන skip පාර.' },
        { en: 'GroupNorm', si: 'Channels කණ්ඩායම් වලට බෙදලා normalize කරන layer එක. Batch size මත රඳා නැහැ.' },
      ],
    },
    // 6
    {
      id: 'transfer-learning-freezing',
      title: 'Transfer Learning සහ Encoders Freeze කරන එක',
      body: [
        'Multimodal model එකක් මුල ඉඳන් train කරන්න images බිලියන ගණන් සහ GPUs දහස් ගණන් ඕනේ. ඒ නිසා අපි කරන්නේ transfer learning: කලින්ම ලොකු data වලින් train කරපු (pretrained) models අරන්, අපේ වැඩේට ගළපන එක. CLIP vision encoder, Whisper encoder, Llama LLM, Stable Diffusion වගේ ඒවා "building blocks" විදිහට ගන්නවා.',
        'Freezing කියන්නේ model එකේ සමහර කොටස් වල weights වෙනස් නොවෙන්න lock කරන එක (PyTorch එකේ requires_grad = False). LLaVA training එක හොඳ උදාහරණයක්. Stage 1: vision encoder එකත් LLM එකත් freeze කරලා, projector එක විතරක් image-caption pairs වලින් train කරනවා. මේක "alignment" පියවර. Stage 2: vision encoder එක තවමත් frozen, projector එකයි LLM එකයි instruction data වලින් fine-tune කරනවා.',
        'ඇයි freeze කරන්නේ? (1) Memory සහ compute අඩුයි, frozen weights වලට gradients සහ optimizer states ඕනේ නෑ. (2) අපේ පොඩි dataset එකෙන් pretrained දැනුම විනාශ වෙන එක (catastrophic forgetting) වළක්වනවා. (3) Overfitting අඩුයි. Data ගොඩක් තියෙනවා නම් පස්සේ unfreeze කරලා ඉතා පොඩි learning rate එකකින් fine-tune කරන්න පුළුවන්.',
        'Diffusion models වලට parameter-efficient ක්‍රම: LoRA (base model එක frozen, පොඩි low-rank matrices විතරක් train කරනවා, file එක MB කිහිපයයි), DreamBooth (images 3-5කින් අලුත් subject එකක් ඉගැන්වීම), Textual Inversion (අලුත් වචනයක embedding එක විතරක් ඉගෙන ගන්නවා). Linear probing (frozen features උඩ classifier එකක් විතරක් train කිරීම) තවත් ක්‍රමයක්.',
      ],
      analogy: 'Kandy වල ඉඳන් Colombo hospital එකකට එන පළපුරුදු doctor කෙනෙක් හිතන්න. වෛද්‍ය විද්‍යාව ආයේ මුල ඉඳන් ඉගෙන ගන්නේ නෑ (frozen encoder). අලුත් hospital එකේ forms, systems විතරක් ඉගෙන ගන්නවා (projector / head එක train කරනවා). Doctor ගේ මූලික දැනුම ආරක්ෂිතයි, වැඩ ඉක්මනින් පටන් ගන්න පුළුවන්.',
      example: 'Sri Lankan කෑම 20ක් (kottu, hoppers, string hoppers, kiribath...) හඳුනාගන්න model එකක්. ඔයා ළඟ images 2,000යි. CLIP ViT-B/32 encoder එක freeze කරලා (parameters මිලියන 88ක් පමණ, train කරන්නේ නෑ), උඩින් linear head එකක් දානවා: 512 × 20 + 20 = parameters 10,260යි. Laptop GPU එකකින් විනාඩි කිහිපයකින් train වෙනවා. සම්පූර්ණ model එක fine-tune කළා නම් images 2,000ට overfit වෙන්න ඉඩ වැඩියි.',
      keyPoints: [
        'Transfer learning = pretrained model එකක් අපේ වැඩේට ගළපන එක.',
        'Freeze = requires_grad = False. Memory අඩුයි, forgetting සහ overfitting අඩුයි.',
        'LLaVA: stage 1 projector විතරක්, stage 2 projector + LLM, vision encoder frozen.',
        'Diffusion customization: LoRA, DreamBooth, Textual Inversion.',
      ],
      terms: [
        { en: 'Transfer Learning', si: 'එක වැඩකට ඉගෙන ගත්ත දැනුම වෙනත් වැඩකට පාවිච්චි කරන එක.' },
        { en: 'Freezing', si: 'Training වලදී layers වල weights update නොවෙන්න lock කරන එක.' },
        { en: 'Catastrophic Forgetting', si: 'අලුත් data වලින් train කරද්දී කලින් ඉගෙන ගත්ත දේවල් අමතක වෙන එක.' },
        { en: 'LoRA', si: 'Frozen weights වලට පොඩි low-rank update matrices එකතු කරලා ඒවා විතරක් train කරන ක්‍රමය.' },
        { en: 'DreamBooth', si: 'Images ටිකකින් diffusion model එකකට අලුත් subject එකක් ඉගැන්වීමේ fine-tuning ක්‍රමය.' },
        { en: 'Textual Inversion', si: 'Model එක වෙනස් නොකර අලුත් concept එකකට token embedding එකක් විතරක් ඉගෙන ගන්නා ක්‍රමය.' },
      ],
    },
    // 7
    {
      id: 'unet-deep-dive',
      title: 'U-Net ගැඹුරින්: Encoder-Decoder, Skip Connections, Autoencoder සහ Diffusion Denoiser',
      body: [
        'U-Net එක මුලින්ම හැදුවේ 2015 දී medical images segment කරන්න (Ronneberger සහ අය). හැඩය "U" අකුර වගේ. වම් පැත්ත encoder (contracting path): convolution layers සහ downsampling වලින් image එක පොඩි කරනවා, channels වැඩි කරනවා. උදා: 64×64 → 32×32 → 16×16 → 8×8. මෙතනදී model එක "මොකක්ද තියෙන්නේ" (what) කියලා ඉගෙන ගන්නවා, ඒත් හරියටම "කොහෙද" (where) කියන විස්තර නැති වෙනවා. පතුලේ bottleneck එක.',
        'දකුණු පැත්ත decoder (expanding path): upsampling (transposed convolution හෝ interpolation) වලින් ආයේ ලොකු කරනවා: 8×8 → 16×16 → ... → 64×64. Skip connections තමයි U-Net එකේ රහස: encoder එකේ හැම level එකකම features, ඒ ප්‍රමාණයේම decoder level එකට කෙලින්ම යවලා concatenate කරනවා. ඒ නිසා encoder එකේ නැති වුණු සියුම් විස්තර (edges, textures, ස්ථානය) decoder එකට ආපහු ලැබෙනවා. Output එකේ size එක input එකේ size එකමයි.',
        'U-Net as autoencoder: encoder-decoder හැඩය autoencoder එකක් වගේම. Denoising autoencoder එකක් විදිහට (noisy image → clean image) U-Net ගොඩක් හොඳයි, skip connections නිසා විස්තර රැකෙනවා. ඒත් සැලකිලිමත් වෙන්න: compression එකක් ඉගෙන ගන්න (bottleneck latent එකක් හදන්න) ඕනේ නම් skip connections අයින් කරන්න ඕනේ. නැත්නම් තොරතුරු bottleneck එක පනිනවා, model එක "copy" කරනවා. Stable Diffusion එකේ VAE එක skip නැති encoder-decoder එකක්. Denoiser එක U-Net එකක්.',
        'Diffusion denoiser විදිහට U-Net (Stable Diffusion 1.x/2.x, SDXL): Inputs තුනක්: (1) noisy latent එක (උදා: 4×64×64), (2) timestep t (sinusoidal embedding එකක් කරලා ResNet blocks වලට එකතු කරනවා), (3) text embeddings (cross-attention layers වලින්). Output: ඒ latent එකේ තියෙන noise එකේ predict එක, input එකේ shape එකමයි. U-Net එකේ ඇතුළේ ResNet blocks, self-attention, cross-attention තියෙනවා. අලුත් models (SD3, FLUX) U-Net වෙනුවට DiT (Diffusion Transformer) පාවිච්චි කරනවා, ඒත් idea එක සමානයි.',
      ],
      analogy: 'Kandy Perahera එකේ aerial photo එකක් කියලා හිතන්න. Encoder = ඔයා ටිකෙන් ටික drone එක උඩට ගන්නවා, මුළු perahera එකම පේනවා (context), ඒත් හැම නර්තන ශිල්පියාගේම මූණ පේන්නේ නෑ. Decoder = ආයේ පහළට එනවා. Skip connections = උඩ යද්දී හැම උසකදීම ගත්ත photos ටික, පහළට එද්දී ඒ ඒ උසේදී ආයේ බලනවා. ඒ නිසා මුළු චිත්‍රයත්, සියුම් විස්තරත් දෙකම ලැබෙනවා.',
      example: 'Stable Diffusion 1.5: 512×512 image → VAE → 4×64×64 latent. U-Net encoder එක 64 → 32 → 16 → 8 දක්වා downsample කරනවා, channels 320 → 640 → 1280 → 1280. Decoder එක 8 → 16 → 32 → 64 ආයේ upsample කරනවා, හැම level එකකදීම encoder features skip connections වලින් concatenate වෙනවා. Output 4×64×64 predicted noise. Denoising steps 25ක් නම් U-Net එක 25 පාරක් run වෙනවා (CFG එක්ක batch එකේ දෙගුණයක්).',
      keyPoints: [
        'U-Net = encoder (downsample) + bottleneck + decoder (upsample) + skip connections.',
        'Skip connections = encoder features decoder එකට concatenate, සියුම් විස්තර රැකෙනවා.',
        'Denoising autoencoder විදිහට හොඳයි. Compression latent එකක් ඕනේ නම් skips නැති autoencoder එකක් (VAE).',
        'Diffusion U-Net inputs: noisy latent + timestep embedding + text (cross-attention). Output: predicted noise.',
        'අලුත් models: U-Net වෙනුවට DiT.',
      ],
      terms: [
        { en: 'U-Net', si: 'Skip connections තියෙන U හැඩයේ encoder-decoder convolutional network එක.' },
        { en: 'Downsampling', si: 'Feature map එකේ height/width අඩු කරන එක (stride convolution, pooling).' },
        { en: 'Upsampling', si: 'Feature map එකේ height/width වැඩි කරන එක (transposed convolution, interpolation).' },
        { en: 'Skip Connection (U-Net)', si: 'Encoder level එකක features එම size එකේ decoder level එකට concatenate කරන පාර.' },
        { en: 'Bottleneck', si: 'Encoder-decoder එකේ කුඩාම, compressed කොටස.' },
        { en: 'Timestep Embedding', si: 'Diffusion step අංකය (t) vector එකක් කරලා network එකට දෙන එක.' },
        { en: 'Image Segmentation', si: 'Image එකේ හැම pixel එකකටම label එකක් දෙන එක. U-Net මුලින් හැදුවේ මේකට.' },
      ],
    },
    // 8
    {
      id: 'text-to-image-pipeline',
      title: 'Text-to-Image Diffusion Pipeline එක මුල සිට අග දක්වා',
      body: [
        'Phase 6 සහ 16 වල diffusion මූලධර්ම ඉගෙන ගත්තා. දැන් සම්පූර්ණ pipeline එක කොටස් වලට ගලවමු. පියවර 1, Text encoder: prompt එක tokenize කරලා CLIP text encoder එකකින් (SD 1.x: CLIP ViT-L/14, tokens 77ක සීමාවක්) embeddings පෙළක් කරනවා. SDXL text encoders දෙකක් පාවිච්චි කරනවා. SD3 සහ FLUX වගේ models CLIP එක්ක T5 text encoder එකත් පාවිච්චි කරනවා, දිගු prompts හොඳට තේරෙනවා.',
        'පියවර 2, Denoising loop: random noise latent එකකින් පටන් ගන්නවා. Denoiser එක (U-Net හෝ DiT) cross-attention හරහා text embeddings බලලා noise එක predict කරනවා. Scheduler (sampler) එක ඒ prediction එක පාවිච්චි කරලා ඊළඟ, ටිකක් පිරිසිදු latent එක ගණනය කරනවා. DDPM, DDIM, Euler, DPM-Solver++ වගේ schedulers තියෙනවා. හොඳ scheduler එකකින් steps 20-30කින් හොඳ image එකක් ගන්න පුළුවන්. Model එක retrain නොකර scheduler එක මාරු කරන්න පුළුවන්.',
        'Classifier-free guidance (CFG): හැම step එකකදීම model එක දෙපාරක් run වෙනවා, prompt එක එක්ක සහ "හිස්" prompt එක එක්ක. Final = uncond + guidance_scale × (cond − uncond). guidance_scale 7-8 වගේ අගයක් සාමාන්‍යයි. වැඩි කළොත් prompt එකට කීකරුයි, ඒත් වර්ණ අධික වෙලා අස්වාභාවික වෙනවා. Negative prompt: ඒ "හිස්" prompt එක වෙනුවට "blurry, low quality, extra fingers" වගේ text එකක් දානවා. එතකොට guidance එක ඒ දේවල් වලින් ඈතට තල්ලු කරනවා.',
        'පියවර 3, VAE decoder: අන්තිම පිරිසිදු latent එක (4×64×64) VAE decoder එකෙන් 512×512×3 pixel image එකක් කරනවා (8 ගුණයක upsampling). අන්තිමට optional safety checker එකක් NSFW අන්තර්ගතය පරීක්ෂා කරනවා. Seed එක එකම නම් (සහ settings එකම නම්) එකම image එක ආයේ ලැබෙනවා. Prompt engineering for images: subject, style, lighting, camera angle, quality words පැහැදිලිව ලියන්න. උදා: "a red tuk-tuk on a rainy Colombo street at night, neon reflections, cinematic lighting, 35mm photo".',
      ],
      analogy: 'Kottu කඩේක order එකක් වගේ. Customer කියන වචන (prompt) waiter ලියාගන්නවා (text encoder). Chef තාච්චියේ ටිකෙන් ටික කොටනවා, හැම පාරම order එක බලනවා (denoising loop + cross-attention). Chef කොටන රිද්මය = scheduler. "කලින් වතාවට වඩා order එකට ගැළපෙන්න" කියන තල්ලුව = CFG. "මිරිස් එපා" = negative prompt. අන්තිමේ plate එකට දාලා serve කරනවා = VAE decoder.',
      example: 'Settings: steps 25, guidance_scale 7.5, seed 42. CFG නිසා හැම step එකකම U-Net forward passes 2ක් (batch එකක් විදිහට). එතකොට U-Net passes 50යි. එක pass එකකට GPU එකක 40 ms නම් 50 × 40 = 2,000 ms, ඒ කියන්නේ තත්පර 2ක් පමණ. Steps 50 කළොත් තත්පර 4ක් පමණ. Quality වෙනස පොඩි වෙන්න පුළුවන්, ඒ නිසා steps 25 වගේ අගයක් හොඳ තේරීමක්.',
      code: {
        lang: 'python',
        src: `# diffusers වලින් text-to-image: scheduler, CFG, negative prompt, seed
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler

pipe = StableDiffusionPipeline.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5", torch_dtype=torch.float16
).to("cuda")
# Scheduler එක මාරු කරනවා: steps අඩුවෙන් හොඳ quality
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)

image = pipe(
    prompt="a red tuk-tuk on a rainy Colombo street, cinematic lighting",
    negative_prompt="blurry, low quality, distorted",  # මේවායින් ඈත් වෙන්න
    num_inference_steps=25,       # denoising steps ගණන
    guidance_scale=7.5,           # CFG ශක්තිය
    generator=torch.Generator("cuda").manual_seed(42),  # එකම seed = එකම image
).images[0]
image.save("tuktuk.png")`,
      },
      keyPoints: [
        'Pipeline = text encoder (CLIP/T5) → denoiser (U-Net/DiT + cross-attention) + scheduler loop → VAE decoder.',
        'Scheduler = noise prediction එකෙන් ඊළඟ latent එක ගණනය කරන නීතිය. Retrain නැතුව මාරු කරන්න පුළුවන්.',
        'CFG = uncond + w(cond − uncond). w වැඩි = prompt එකට කීකරුයි, ඒත් අධික වුණොත් අස්වාභාවිකයි.',
        'Negative prompt = unconditional පැත්තට දාන text එක, ඒ දේවල් වලින් ඈතට.',
        'එකම seed + settings = එකම image (reproducibility).',
      ],
      terms: [
        { en: 'Text Encoder', si: 'Prompt එක denoiser එකට තේරෙන embeddings පෙළක් කරන model එක (CLIP text, T5).' },
        { en: 'Scheduler / Sampler', si: 'Denoising steps වල noise ඉවත් කරන ගණිත නීතිය (DDIM, Euler, DPM-Solver++).' },
        { en: 'Guidance Scale', si: 'CFG එකේ ශක්තිය. Prompt එකට කොච්චර තදින් කීකරු වෙනවද.' },
        { en: 'Negative Prompt', si: 'Image එකේ නොතිබිය යුතු දේවල් කියන text එක.' },
        { en: 'Seed', si: 'පටන් ගන්න random noise එක තීරණය කරන අංකය.' },
        { en: 'DiT (Diffusion Transformer)', si: 'U-Net වෙනුවට transformer එකක් denoiser විදිහට පාවිච්චි කරන architecture එක.' },
        { en: 'Prompt Engineering (images)', si: 'Subject, style, lighting, composition පැහැදිලිව ලියලා හොඳ images ගන්න කලාව.' },
      ],
    },
    // 9
    {
      id: 'image-editing-controlnet',
      title: 'Image Editing: Image-to-Image, Inpainting, Outpainting සහ ControlNet',
      body: [
        'Image-to-image (img2img): හිස් noise එකකින් පටන් ගන්නේ නැතුව, තියෙන image එකක latent එකට noise ටිකක් එකතු කරලා එතන ඉඳන් denoise කරනවා. "strength" parameter එක (0 ඉඳන් 1 දක්වා) කොච්චර noise දානවද තීරණය කරනවා. 0.3 නම් මුල් image එකට ගොඩක් සමානයි. 0.9 නම් ගොඩක් වෙනස් වෙනවා. Sketch එකක් photo එකක් කරන්න, style මාරු කරන්න මේක පාවිච්චි කරනවා.',
        'Inpainting: image එකේ කොටසක් mask එකකින් (සුදු = වෙනස් කරන්න, කළු = තියාගන්න) තෝරලා, ඒ කොටස විතරක් prompt එකට අනුව අලුතින් හදනවා. උදා: photo එකක ඉන්න අනවශ්‍ය කෙනෙක් අයින් කරන එක. Outpainting: image එකේ මායිමෙන් එහාට canvas එක දිගු කරලා අලුත් කොටස් හදන එක. Inpainting models train කරන්නේ mask එකත් අමතර input channels විදිහට දීලා.',
        'ControlNet (2023): prompt එකට අමතරව structure එක පාලනය කරන්න. Edge map (Canny), depth map, human pose (OpenPose skeleton), scribble වගේ "control image" එකක් දෙනවා. ඇතුළත වැඩේ: මුල් diffusion model එක lock (freeze) කරලා, U-Net encoder එකේ trainable copy එකක් හදනවා. ඒ copy එක control image එක process කරලා, "zero convolutions" (weights 0 න් පටන් ගන්න 1×1 conv) හරහා මුල් U-Net එකට එකතු කරනවා. මුලදී zero නිසා මුල් model එකට හානියක් නෑ, training වලදී ටිකෙන් ටික බලපෑම ඉගෙන ගන්නවා.',
        'අනිත් editing ක්‍රම: InstructPix2Pix ("make it night time" වගේ instruction එකකින් edit කරනවා), IP-Adapter (text වෙනුවට reference image එකක් prompt එකක් විදිහට), super-resolution upscalers. මේ හැම එකක්ම Phase 16 එකේ diffusion මූලධර්ම උඩ හැදුණු දේවල්.',
      ],
      analogy: 'ගෙදර පරණ wedding photo එකක් photo studio එකකට දෙනවා කියලා හිතන්න. img2img = "මේකම oil painting එකක් වගේ කරන්න". Inpainting = "පස්සෙන් ඉන්න කෙනාව අයින් කරලා බිත්තිය දාන්න". Outpainting = "photo එක දෙපැත්තට ලොකු කරන්න". ControlNet = "මගේ ඉරියව්ව (pose) හරියටම මේ විදිහටම තියාගෙන, ඇඳුම විතරක් සාරියක් කරන්න".',
      example: 'Galle Face එකේ photo එකක් (512×512). img2img strength 0.6, steps 30 නම් ඇත්තටම run වෙන්නේ steps 0.6 × 30 = 18යි, මුල් steps 12 අතහරිනවා. Inpainting: පස්සෙන් තියෙන කුණු බක්කිය mask කරලා prompt "empty sandy beach" දෙනවා. ControlNet (OpenPose): cricket batsman කෙනෙක්ගේ pose skeleton එක දීලා "a robot playing cricket" prompt කරාම robot එක හරියටම ඒ pose එකෙන්ම ඉන්නවා.',
      keyPoints: [
        'img2img = තියෙන image එකට noise එකතු කරලා denoise. strength = කොච්චර වෙනස් කරනවද.',
        'Inpainting = mask කරපු කොටස විතරක් අලුතින්. Outpainting = canvas එක දිගු කරනවා.',
        'ControlNet = locked model + trainable encoder copy + zero convolutions. Edges/depth/pose වලින් structure පාලනය.',
        'IP-Adapter = image එකක් prompt එකක් විදිහට. InstructPix2Pix = instruction වලින් edit.',
      ],
      terms: [
        { en: 'Image-to-Image (img2img)', si: 'තියෙන image එකක් අලුත් prompt එකකට අනුව වෙනස් කරන diffusion ක්‍රමය.' },
        { en: 'Denoising Strength', si: 'img2img වලදී මුල් image එකට කොච්චර noise දානවද (0-1).' },
        { en: 'Inpainting', si: 'Mask කරපු කොටසක් විතරක් අලුතින් generate කරන එක.' },
        { en: 'Outpainting', si: 'Image එකේ මායිමෙන් පිටතට අලුත් අන්තර්ගතය generate කරන එක.' },
        { en: 'ControlNet', si: 'Edges, depth, pose වගේ control images වලින් diffusion output එකේ structure පාලනය කරන network එක.' },
        { en: 'Zero Convolution', si: 'Weights 0 න් පටන් ගන්න 1×1 convolution. ControlNet මුලදී model එකට හානි නොකරන්න.' },
      ],
    },
    // 10
    {
      id: 'speech-and-audio',
      title: 'Speech සහ Audio: ASR (Whisper), TTS සහ Audio Generation',
      body: [
        'ASR (Automatic Speech Recognition) කියන්නේ කතාව text වලට හරවන එක. Whisper (OpenAI, 2022) encoder-decoder transformer එකක්. Audio එක 16 kHz කරලා, තත්පර 30 කොටස් log-Mel spectrogram කරලා encoder එකට දෙනවා. Decoder එක text tokens එකින් එක generate කරනවා (LLM එකක් වගේ). විශේෂ tokens වලින් භාෂාව, "transcribe" ද "translate" ද (English වලට), timestamps ද කියලා කියනවා. Whisper සිංහලත් support කරනවා, ඒත් English වලට වඩා වැරදි වැඩියි.',
        'ASR වලට තවත් ප්‍රධාන ක්‍රමයක් CTC (Connectionist Temporal Classification) loss එක. Audio frames සහ අකුරු අතර හරියටම alignment එකක් දන්නේ නැතුව train කරන්න පුළුවන්. NVIDIA NeMo එකේ Conformer, FastConformer, Parakeet වගේ ASR models CTC හෝ RNN-T (Transducer) පාවිච්චි කරනවා. ASR quality මනින්නේ WER (Word Error Rate) එකෙන්: (substitutions + deletions + insertions) ÷ ඇත්ත වචන ගණන.',
        'TTS (Text-to-Speech) සාම්ප්‍රදායිකව පියවර දෙකක්. (1) Acoustic model එක (FastPitch, Tacotron 2) text එකෙන් mel spectrogram එකක් හදනවා. ඊට කලින් text normalization ("Rs. 250" → "රුපියල් දෙසිය පනහ") සහ G2P (අකුරු → ශබ්ද) කරනවා. (2) Vocoder එකක් (HiFi-GAN වගේ) mel spectrogram එක ඇත්ත waveform එකක් කරනවා. අලුත් models (VITS, LLM-based TTS) end-to-end, සමහර ඒවා audio codec tokens predict කරලා තත්පර කිහිපයක sample එකකින් කටහඬ clone කරනවා.',
        'Audio generation (සංගීතය, ශබ්ද effects): MusicGen වගේ models EnCodec tokens autoregressive විදිහට predict කරනවා. AudioLDM වගේ ඒවා mel spectrogram latent එකක diffusion කරනවා. ඒ කියන්නේ images වලට පාවිච්චි කරපු ක්‍රමම audio වලටත්. Voice assistant pipeline එක: ASR → LLM → TTS. Latency අඩු කරන්න streaming ASR සහ streaming TTS පාවිච්චි කරනවා.',
      ],
      analogy: 'ASR = පාර්ලිමේන්තුවේ Hansard ලියන කෙනා. කතා කරන දේ ලියාගන්නවා. TTS = radio එකේ පුවත් කියවන announcer. ලියපු පුවත කටහඬින් කියනවා. Vocoder = announcer ගේ උගුර. "මොනවා කියන්නද, කොහොම ශබ්දය උස් පහත් කරන්නද" කියන සැලැස්ම (mel) ඇත්ත ශබ්දයක් කරනවා.',
      example: 'Customer කියනවා "මට colombo යන්න bus එකක් ඕනේ" (ඇත්ත වචන 6යි). ASR output එක "මට colombo යන්න bus එක ඕනේ". එක substitution එකක් ("එකක්" → "එක"). WER = 1 ÷ 6 ≈ 16.7%. TTS: "Bus එක Rs. 120යි" → normalization → "Bus එක රුපියල් එකසිය විස්සයි" → mel spectrogram → HiFi-GAN → 22.05 kHz audio.',
      keyPoints: [
        'Whisper = log-Mel (16 kHz, 30 s) → encoder → decoder text tokens. Multilingual, translate කරන්නත් පුළුවන්.',
        'CTC / RNN-T = alignment නොදැන ASR train කරන losses (NeMo Conformer/Parakeet).',
        'WER = (S + D + I) ÷ N. අඩු = හොඳයි.',
        'TTS = text normalization → acoustic model (mel) → vocoder (waveform).',
        'Audio generation = codec tokens autoregressive (MusicGen) හෝ diffusion (AudioLDM).',
      ],
      terms: [
        { en: 'ASR', si: 'Automatic Speech Recognition. කතාව text වලට හරවන එක.' },
        { en: 'CTC', si: 'Audio frames සහ text අතර alignment නොදැන ASR train කරන loss එක.' },
        { en: 'WER (Word Error Rate)', si: 'ASR වැරදි ප්‍රමාණය: (substitutions + deletions + insertions) ÷ ඇත්ත වචන.' },
        { en: 'Vocoder', si: 'Mel spectrogram එකක් ඇසෙන waveform එකක් කරන model එක (HiFi-GAN).' },
        { en: 'Text Normalization', si: 'අංක, කෙටි යෙදුම් සම්පූර්ණ වචන වලට හරවන එක (Rs. 120 → රුපියල් එකසිය විස්ස).' },
        { en: 'G2P (Grapheme-to-Phoneme)', si: 'ලියපු අකුරු උච්චාරණ ශබ්ද (phonemes) වලට හරවන එක.' },
        { en: 'Voice Cloning', si: 'කෙටි sample එකකින් කෙනෙක්ගේ කටහඬ අනුකරණය කරන TTS හැකියාව.' },
      ],
    },
    // 11
    {
      id: 'video-generation',
      title: 'Video Generation: High-Level දළ විශ්ලේෂණය',
      body: [
        'Video generation කියන්නේ image generation + කාලය. අමාරුම කොටස temporal consistency: frame එකෙන් frame එකට චරිතයේ මූණ, ඇඳුම, background එක එකම විදිහට තියාගන්න එක, සහ චලනය ස්වාභාවික වෙන එක. Frame එකින් එක වෙන වෙනම generate කළොත් flicker වෙනවා (දිලිසෙනවා).',
        'ප්‍රධාන ක්‍රම: (1) Image diffusion model එකකට temporal layers (frames අතර attention, temporal convolution) එකතු කරන එක. Spatial layers images වලින් ඉගෙන ගත්ත දේවල් තියාගන්නවා, temporal layers චලනය ඉගෙන ගන්නවා. (2) Video VAE එකකින් video එක අවකාශය සහ කාලය දෙකෙන්ම compress කරලා, spacetime patches මත Diffusion Transformer (DiT) එකක් run කරන එක. OpenAI ගේ Sora report එක මේ "spacetime patches" idea එක විස්තර කළා. NVIDIA Cosmos වගේ world foundation models physical AI (robotics, self-driving) වලට video generate කරනවා.',
        'Video වර්ග: text-to-video, image-to-video (photo එකක් චලනය කරන එක), video-to-video (style මාරු කිරීම). අභියෝග: compute ගොඩක් ඕනේ (frames 100ක් = images 100ක් වගේ), දිගු videos වල consistency, physics වැරදි (වතුර උඩට ගලනවා වගේ). ඒ නිසා බොහෝ models තත්පර කිහිපයක clips හදනවා, දිගු videos හදන්නේ කොටස් එකට ගලපලා.',
      ],
      analogy: 'Flip book එකක් හිතන්න. හැම පිටුවකම චිත්‍රයක්. ඉක්මනින් පෙරළුවාම චලනයක් පේනවා. හැම පිටුවම වෙන වෙනම artists ලා ඇන්දොත් චරිතයේ මූණ හැම පිටුවකම වෙනස් වෙනවා. Temporal attention කියන්නේ එක artist කෙනෙක් කලින් පිටු බලමින් ඊළඟ පිටුව අඳින එක.',
      example: 'තත්පර 5ක, 24 fps, 512×512 video එකක් = frames 120යි. Pixels 120 × 512 × 512 × 3 ≈ මිලියන 94යි. Video VAE එකක් අවකාශයෙන් 8 ගුණයක් සහ කාලයෙන් 4 ගුණයක් compress කළොත් latent එක 30 × 64 × 64 (channels කිහිපයක් එක්ක). DiT patch 2×2 නම් tokens 30 × 32 × 32 = 30,720යි. ඒ නිසයි video models වලට ලොකු GPUs ඕනේ.',
      keyPoints: [
        'Video = images + කාලය. ලොකුම අභියෝගය temporal consistency.',
        'ක්‍රම: image diffusion + temporal layers, නැත්නම් video VAE + spacetime DiT.',
        'Text-to-video, image-to-video, video-to-video.',
        'Compute ගොඩක්, clips කෙටියි, physics වැරදි වෙන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Temporal Consistency', si: 'Frames අතර චරිත, වර්ණ, objects ස්ථාවරව තියෙන එක.' },
        { en: 'Temporal Attention', si: 'එකම pixel ස්ථානයේ වෙනස් frames අතර attention.' },
        { en: 'Video VAE', si: 'Video එක අවකාශය සහ කාලය දෙකෙන්ම compress කරන autoencoder එක.' },
        { en: 'Image-to-Video', si: 'Still image එකකින් චලනය වන video එකක් generate කරන එක.' },
        { en: 'World Foundation Model', si: 'භෞතික ලෝකය simulate කරන video models (උදා: NVIDIA Cosmos).' },
      ],
    },
    // 12
    {
      id: 'multimodal-data-prep',
      title: 'Multimodal Data Preprocessing සහ Modalities අතර Data Quality',
      body: [
        'NCA-GENM exam එකේ ලොකුම කොටස (25%) experimentation, ඒ කියන්නේ data සකස් කිරීම සහ quality පරීක්ෂා කිරීම. Multimodal data එන්නේ විවිධ තැන් වලින්: web scraping (image + alt-text), phone recordings, CCTV video, scanned documents, sensors. හැම source එකකම format, quality, noise වෙනස්. Model එක හොඳ වෙන්නේ data එක හොඳ නම් විතරයි.',
        'Normalization (modality අනුව): Images: එකම resolution එකකට resize/crop, RGB කරන්න, pixel අගයන් normalize කරන්න (CLIP එකේ mean/std). Aspect ratios ගොඩක් වෙනස් නම් "aspect ratio bucketing" (සමාන හැඩ තියෙන images එකම batch එකට). Audio: එකම sample rate එකකට resample (උදා: 16 kHz), mono කරන්න, loudness normalize, නිශ්ශබ්ද කොටස් කපන්න. Video: එකම fps එකකට, එකම resolution එකකට, audio track එක sync ද බලන්න. Text: encoding (UTF-8), සිංහල Unicode හරිද (ZWJ), whitespace.',
        'Cross-modal quality checks: (1) Alignment: caption එක ඇත්තටම image එකට ගැළපෙනවද? CLIP similarity එක ගණනය කරලා threshold එකකට අඩු pairs අයින් කරනවා (LAION dataset එක English pairs වලට 0.28 වගේ threshold එකක් පාවිච්චි කළා). Audio transcript එක audio එකට timing අනුව ගැළපෙනවද? (2) Caption quality: "IMG_2034.jpg", "click here" වගේ කුණු captions අයින් කරන්න, නැත්නම් VLM එකකින් re-caption කරන්න (DALL-E 3 synthetic captions වලින් ලොකු වාසියක් ගත්තා). (3) Deduplication: perceptual hash (pHash) හෝ embedding similarity වලින් එකම/ගොඩක් සමාන images අයින් කරන්න, නැත්නම් model එක ඒවා කටපාඩම් කරනවා.',
        'Filtering: NSFW classifiers, watermark detection, aesthetic score, අඩු resolution, බොඳ (blur) images, භාෂාව හඳුනාගැනීම (language ID), PII (මූණු, number plates, ID numbers) blur කිරීම. Consistency check: train/val/test splits වල එකම image එක නැද්ද (data leakage), classes balanced ද, modality එකක් missing නම් මොකද කරන්නේ (drop, placeholder). හැම filter එකකින්ම කොච්චර අයින් වුණාද කියලා log කරන්න.',
      ],
      analogy: 'Dambulla economic centre එකට ගොවීන් සිය ගණනකින් එළවළු එනවා. සමහර ඒවා කුණුයි, සමහර ඒවායේ label වැරදියි ("බෝංචි" කියලා ලියලා ඇතුළේ බණ්ඩක්කා), සමහර ඒවා එකම ගොවියාගෙන් දෙපාරක් ඇවිල්ලා. Supermarket එකට යවන්න කලින් තෝරනවා, label check කරනවා, එකම ප්‍රමාණයේ පෙට්ටි වලට දානවා. Data preprocessing කියන්නේ මේකමයි.',
      example: 'Web වලින් image-caption pairs 1,000,000ක් ගත්තා. Resolution 256ට අඩු: 120,000ක් අයින්. Duplicates (pHash): 80,000ක් අයින්. CLIP similarity 0.28ට අඩු: 300,000ක් අයින්. NSFW: 20,000ක් අයින්. ඉතුරු 480,000යි, ඒ කියන්නේ 48%යි. ප්‍රමාණය අඩු වුණත් quality වැඩි නිසා model එක හොඳ වෙනවා. Audio dataset එකක 8 kHz, 44.1 kHz, 48 kHz files මිශ්‍ර නම් හැම එකක්ම 16 kHz mono කරනවා.',
      keyPoints: [
        'Images: resize, RGB, normalize, aspect ratio bucketing. Audio: resample (16 kHz), mono, loudness. Video: fps/resolution, audio sync.',
        'Alignment check: CLIP similarity threshold එකකින් නොගැළපෙන pairs අයින් කරන්න.',
        'Caption quality: කුණු captions අයින් කරන්න හෝ VLM එකකින් re-caption.',
        'Dedup (pHash, embeddings), NSFW/watermark/PII filtering, split leakage check.',
        'හැම filter පියවරකම stats log කරන්න.',
      ],
      terms: [
        { en: 'Data Alignment', si: 'එකම sample එකේ modalities (image-caption, audio-transcript) ඇත්තටම ගැළපෙනවද කියන එක.' },
        { en: 'Re-captioning', si: 'දුර්වල captions වෙනුවට VLM එකකින් හොඳ, විස්තරාත්මක captions ලියන එක.' },
        { en: 'Perceptual Hash (pHash)', si: 'පේන හැටි අනුව image එකකට කෙටි fingerprint එකක්. සමාන images හොයන්න.' },
        { en: 'Deduplication', si: 'එකම හෝ ගොඩක් සමාන samples dataset එකෙන් අයින් කරන එක.' },
        { en: 'NSFW Filtering', si: 'නුසුදුසු (අසභ්‍ය, ප්‍රචණ්ඩ) අන්තර්ගතය classifier එකකින් අයින් කරන එක.' },
        { en: 'Aspect Ratio Bucketing', si: 'සමාන දිග-පළල අනුපාත තියෙන images එකම batch එකට දාන training උපක්‍රමය.' },
        { en: 'Data Leakage', si: 'Test data train set එකටත් රිංගලා results බොරු විදිහට හොඳ වෙන එක.' },
      ],
    },
    // 13
    {
      id: 'multimodal-rag',
      title: 'Multimodal RAG, Vector Databases සහ Python NLP Packages',
      body: [
        'Phase 6 සහ 13 වල text RAG ඉගෙන ගත්තා. Multimodal RAG එකේදී knowledge base එකේ images, tables, charts, PDFs scans, audio තියෙනවා. ක්‍රම තුනක් තියෙනවා. (1) Shared embedding space: CLIP වගේ model එකකින් images සහ text query දෙකම එකම space එකට embed කරලා search කරනවා. (2) Captioning-based retrieval: හැම image එකකටම VLM එකකින් විස්තරාත්මක caption එකක් (හෝ OCR text) ලියලා, ඒ text එක සාමාන්‍ය text embedding model එකකින් index කරනවා. Text search ගොඩක් හොඳ නිසා බොහෝ විට මේක හොඳට වැඩ කරනවා. (3) Hybrid: දෙකම index කරලා, retrieve කරපු මුල් image එකම VLM එකට generation වලදී දෙනවා.',
        'Vector databases: Milvus (NVIDIA cuVS/GPU indexes support කරනවා), FAISS (library එකක්, GPU support තියෙනවා), pgvector, Qdrant, Weaviate. Image embeddings dimension එක model එක අනුව (CLIP ViT-B/32 = 512, ViT-L/14 = 768). Metadata (source, page, date) එක්කම store කරන්න, filter කරන්න පුළුවන් වෙන්න. Audio සහ video වලට transcript (Whisper) + timestamps index කරලා, හරියටම ඒ තත්පරයට jump කරන්න පුළුවන්.',
        'Python NLP packages: spaCy (වේගවත් production NLP: tokenization, NER, sentence splitting, POS tagging), NLTK (ඉගෙනීමට හොඳ classic toolkit: tokenizers, stopwords, stemming, WordNet), Hugging Face (transformers = pretrained models, datasets = data load කිරීම, tokenizers, sentence-transformers = embeddings). RAG වලදී spaCy එකෙන් chunking/NER (උදා: දින, නම්, මුදල් extract කිරීම) කරන්න පුළුවන්.',
        'Use case එකකට ඕනේ system components: ingestion (PDF parser, OCR, ASR, frame extractor), preprocessing සහ chunking, embedding models (text + image), vector database, retriever + reranker, generator (LLM හෝ VLM), guardrails (NeMo Guardrails), serving (Triton / NIM), monitoring සහ evaluation. Use case එක අනුව තෝරන්න: product image search නම් CLIP + vector DB ප්‍රමාණවත්. Scanned contracts ගැන ප්‍රශ්න නම් OCR/VLM + text RAG.',
      ],
      analogy: 'Library එකක පොත් (text), photo albums (images), cassette tapes (audio) තියෙනවා. Captioning-based retrieval = librarian හැම album එකකටම සහ tape එකකටම "මේකේ තියෙන්නේ මොනවද" කියලා card එකක් ලියලා card catalog එකට දානවා. Shared embedding = librarian ට photo එකක් පෙන්නලා "මේ වගේ ඒවා දෙන්න" කිව්වාම කෙලින්ම හොයලා දෙනවා.',
      example: 'Hotel chain එකක brochures 500ක් (PDF, photos එක්ක). Pages 5,000ක් OCR කරලා text chunks 20,000ක් හදනවා. Photos 3,000ට VLM captions ලියනවා ("infinity pool overlooking Bentota beach"). Text embedding 768-dim නම් vectors 23,000 × 768 × 4 bytes ≈ 70 MB. Query: "Pool එකක් තියෙන, මුහුද පේන කාමර කොහෙද?" → retriever top-5 (caption chunks 3 + text chunks 2) → VLM එකට මුල් photos 3 සහ text දීලා සිංහලෙන් උත්තරය.',
      keyPoints: [
        'Multimodal RAG: shared embedding (CLIP), captioning/OCR-based retrieval, හෝ hybrid.',
        'Vector DBs: Milvus (GPU), FAISS, pgvector, Qdrant. Metadata එක්ක store කරන්න.',
        'spaCy = production NLP (NER, sentences). NLTK = classic toolkit. Hugging Face = models, datasets, embeddings.',
        'Components: ingestion/OCR/ASR → chunk → embed → vector DB → rerank → LLM/VLM → guardrails → serving.',
      ],
      terms: [
        { en: 'Multimodal RAG', si: 'Images, audio, tables වගේ data එක්කත් retrieve කරලා generate කරන RAG.' },
        { en: 'Captioning-based Retrieval', si: 'Images වලට text captions ලියලා ඒ text index කරලා search කරන ක්‍රමය.' },
        { en: 'OCR', si: 'Optical Character Recognition. Image එකක තියෙන අකුරු text බවට හරවන එක.' },
        { en: 'Milvus', si: 'GPU-accelerated indexes support කරන open-source vector database එක.' },
        { en: 'spaCy', si: 'NER, tokenization, sentence splitting වලට වේගවත් production Python NLP library එක.' },
        { en: 'NLTK', si: 'Tokenizers, stopwords, stemming තියෙන classic Python NLP toolkit එක.' },
        { en: 'Reranker', si: 'Retrieve කරපු results query එකට ගැළපෙන හැටියට ආයේ පෙළගස්වන model එක.' },
      ],
    },
    // 14
    {
      id: 'attention-maps-data-analysis',
      title: 'Data Analysis: Attention Maps, Cross-Attention Visualization සහ Data Mining',
      body: [
        'Attention maps කියන්නේ model එක "කොහෙද බලන්නේ" කියලා පෙන්නන heatmaps. ViT එකක [CLS] token එක patches වලට දෙන attention weights 14×14 grid එකක් කරලා image එක උඩින් overlay කළාම model එක වැදගත් කියලා හිතන කොටස් පේනවා. Layers ගොඩක් හරහා attention එකට එකතු කරන "attention rollout" ක්‍රමයකුත් තියෙනවා. CNNs වලට Grad-CAM (gradients වලින් heatmap) පාවිච්චි කරනවා.',
        'Cross-attention visualization (diffusion): Stable Diffusion U-Net එකේ cross-attention එකේ queries = image latent ස්ථාන, keys = prompt tokens. ඉතින් එක word එකකට (උදා: "tuk-tuk") attention map එක ගත්තාම image එකේ ඒ වචනය "ඇඳපු" තැන පේනවා. Prompt-to-Prompt වගේ editing ක්‍රම මේ maps හසුරුවලා edit කරනවා. වචනයක් image එකේ නැත්නම් (prompt එක නොසලකා හැරියා නම්) ඒ map එක දුර්වලයි. Debug කරන්න හොඳ tool එකක්.',
        'සැලකිලිමත් වෙන්න: attention weights සම්පූර්ණ "explanation" එකක් නෙවෙයි. ඒවා එක layer එකක, එක head එකක තොරතුරු ගලන හැටි විතරයි පෙන්නන්නේ. Heads සහ layers කිහිපයක average කරලා, අනිත් ක්‍රම (Grad-CAM, ablation) එක්ක සසඳලා බලන්න.',
        'Data mining සහ visualization: dataset එකේ embeddings (CLIP) UMAP හෝ t-SNE වලින් 2D කරලා plot කළාම clusters, outliers, duplicates, mislabeled data පේනවා. Caption දිග histogram, resolution distribution, audio duration distribution, class balance bar chart, modality එකක් missing වුණු samples ගණන බලන්න. Tools: matplotlib/seaborn, pandas, FiftyOne වගේ dataset viewers, TensorBoard. Model errors cluster කරලා "කොයි වර්ගයේ images වලද වැරදෙන්නේ" කියලා හොයන එකත් data mining.',
      ],
      analogy: 'Cricket match එකක Hawk-Eye එක වගේ. Ball එක ගිය පාර පේනවා, ඒත් bowler මොනවා හිතුවද කියලා කියන්නේ නෑ. Attention map එකත් එහෙමයි: model එක "බැලුව" තැන පෙන්නනවා, ඒත් තීරණය ගැන සම්පූර්ණ කතාව නෙවෙයි. UMAP plot එක = Colombo map එකක ගෙවල් ලකුණු කරලා, එකට තියෙන ගම්මාන (clusters) සහ තනිවම තියෙන ගෙවල් (outliers) බලන එක.',
      example: 'Prompt: "a dog sitting next to a red tuk-tuk". Cross-attention maps: "dog" token එකේ map එක image එකේ වම් පැත්තේ දීප්තිමත්, "tuk-tuk" එකේ map එක දකුණු පැත්තේ. "red" map එක tuk-tuk එකේ ඇඟ උඩ. ඒත් generate වුණ image එකේ බල්ලා නැත්නම් "dog" map එක හැම තැනම දුර්වලයි, ඒ කියන්නේ model එක ඒ වචනය නොසලකා හැරියා. Data mining: embeddings 50,000ක UMAP plot එකේ තනිවම තියෙන points 200ක් බැලුවාම 150ක් හිස් සුදු images වුණා, ඒවා අයින් කළා.',
      keyPoints: [
        'Attention maps = model එක image එකේ කොහෙද බලන්නේ කියන heatmap (ViT [CLS], attention rollout).',
        'Cross-attention maps (diffusion) = prompt එකේ හැම වචනයක්ම image එකේ කොහෙද බලපාන්නේ.',
        'Attention = සම්පූර්ණ explanation එකක් නෙවෙයි. Grad-CAM, ablation එක්ක සසඳන්න.',
        'Data mining = UMAP/t-SNE, distributions, outliers, error clusters.',
      ],
      terms: [
        { en: 'Attention Map', si: 'Tokens/patches අතර attention weights heatmap එකක් විදිහට.' },
        { en: 'Attention Rollout', si: 'Layers කිහිපයක attention එකට ගුණ කරලා input එකට ආපසු trace කරන ක්‍රමය.' },
        { en: 'Grad-CAM', si: 'Gradients පාවිච්චි කරලා CNN එකක් බලපු කොටස් heatmap එකක් කරන ක්‍රමය.' },
        { en: 'UMAP / t-SNE', si: 'Embeddings වැනි ගොඩක් dimensions තියෙන data 2D/3D කරලා plot කරන ක්‍රම.' },
        { en: 'Data Mining', si: 'ලොකු datasets වල රටා, outliers, ගැටලු හොයාගන්න එක.' },
        { en: 'Outlier', si: 'අනිත් data වලට ගොඩක් වෙනස් sample එකක්. බොහෝ විට error එකක්.' },
      ],
    },
    // 15
    {
      id: 'performance-optimization',
      title: 'Performance Optimization: Hyperparameter Tuning, Computational Efficiency, Training Optimization',
      body: [
        'Hyperparameter tuning: learning rate, batch size, warmup steps, weight decay, LoRA rank, CFG scale, sampling steps වගේ අපි අතින් තෝරන settings. Grid search (හැම combination එකක්ම), random search (අහඹු combinations, බොහෝ විට grid එකට වඩා කාර්යක්ෂමයි), Bayesian optimization (කලින් results බලලා ඊළඟ හොඳ attempt එක තෝරනවා, Optuna වගේ tools). Learning rate එක තමයි වැදගත්ම එක. මුලින් පොඩි model එකක/data subset එකක ඉක්මන් experiments කරන්න.',
        'Training optimization: mixed precision (BF16/FP16), gradient accumulation (පොඩි batches කිහිපයක gradients එකතු කරලා ලොකු batch එකක effect එක), gradient (activation) checkpointing (activations save නොකර backward වලදී ආයේ ගණනය කරනවා: memory අඩුයි, compute ~30% වැඩියි), FlashAttention, torch.compile. Multi-GPU: DDP (හැම GPU එකකම model copy එකක්, data බෙදනවා), FSDP/ZeRO (model එකත් GPUs අතර බෙදනවා). Frozen encoders වල outputs (උදා: VAE latents, CLIP text embeddings) කලින්ම compute කරලා cache කරන එකත් ලොකු ඉතිරියක්.',
        'Data loading bottleneck: GPU එක නිකන් ඉන්නවා නම් ප්‍රශ්නය data loader එකේ. Image decode/resize CPU එකේ හෙමින් නම් NVIDIA DALI එකෙන් GPU එකේ decode/augment කරන්න පුළුවන්. num_workers වැඩි කරන්න, pin_memory, WebDataset වගේ shard formats. nvidia-smi එකෙන් GPU utilization බලන්න, PyTorch Profiler / Nsight Systems වලින් කොහෙද කාලය යන්නේ කියලා හොයන්න.',
        'Inference efficiency (multimodal): diffusion steps අඩු කිරීම (හොඳ scheduler, distilled models: LCM, SDXL Turbo වගේ steps 1-4), FP16/INT8 quantization, TensorRT engines, Triton dynamic batching, VLM එකකට image resolution/visual tokens අඩු කිරීම. හැම වෙනස්කමකටම පස්සේ quality metrics (FID, CLIP score, WER) ආයේ මැනලා බලන්න.',
      ],
      analogy: 'Hyperparameter tuning = අම්මා අලුත් curry එකකට ලුණු, මිරිස්, තුනපහ ප්‍රමාණය හොයනවා. හැම combination එකක්ම උයන්නේ නැතුව, කලින් රස බලලා ඊළඟ පාර වෙනස් කරනවා (Bayesian). Gradient accumulation = එකපාර ලොකු බඩු ගොඩක් ගෙනියන්න බෑ නම්, tuk-tuk එකේ trips 4කින් ගෙනියනවා, ප්‍රතිඵලය එකමයි. Checkpointing = notes හැම එකක්ම ලියාගන්නේ නැතුව, ඕනේ වුණාම ආයේ ගණනය කරනවා.',
      example: 'GPU එකට batch 8ක් විතරයි ගැළපෙන්නේ, ඒත් ඔයාට effective batch 64ක් ඕනේ. Gradient accumulation steps = 64 ÷ 8 = 8. GPUs 4ක් තියෙනවා නම් (DDP): 64 ÷ (8 × 4) = accumulation steps 2යි. Caching: SD fine-tuning වලදී images 10,000ක VAE latents කලින්ම compute කළා. Epochs 10ක් නම් VAE encoder runs 100,000 වෙනුවට 10,000යි. LCM: steps 25 → 4, ඒ කියන්නේ inference ~6 ගුණයක් වේගවත්, quality ටිකක් අඩු වෙන්න පුළුවන්.',
      keyPoints: [
        'Tuning: grid < random < Bayesian (Optuna). Learning rate වැදගත්ම.',
        'Memory: mixed precision, gradient accumulation, activation checkpointing, FSDP.',
        'Speed: FlashAttention, torch.compile, frozen encoder outputs cache, DALI data loading.',
        'Inference: steps අඩු (LCM/Turbo), quantization, TensorRT, dynamic batching.',
        'Optimization එකකට පස්සේ quality metrics ආයේ මනින්න.',
      ],
      terms: [
        { en: 'Gradient Accumulation', si: 'පොඩි batches කිහිපයක gradients එකතු කරලා එක update එකක් කරන එක.' },
        { en: 'Activation Checkpointing', si: 'Activations save නොකර backward වලදී ආයේ ගණනය කරලා memory ඉතිරි කරන එක.' },
        { en: 'Bayesian Optimization', si: 'කලින් trials වල results අනුව ඊළඟ hyperparameters තෝරන tuning ක්‍රමය.' },
        { en: 'NVIDIA DALI', si: 'Images/video/audio decode සහ augmentation GPU එකේ කරන data loading library එක.' },
        { en: 'FSDP', si: 'Fully Sharded Data Parallel. Weights, gradients, optimizer states GPUs අතර බෙදන ක්‍රමය.' },
        { en: 'Distilled Diffusion (LCM, Turbo)', si: 'Steps 1-4කින් images හදන්න distill කරපු diffusion models.' },
      ],
    },
    // 16
    {
      id: 'frameworks-nemo-triton',
      title: 'PyTorch vs TensorFlow, NVIDIA NeMo සහ Triton (Multimodal Pipelines)',
      body: [
        'PyTorch: Python වගේම ලියන්න පුළුවන් eager (dynamic) execution, debug කරන්න ලේසියි. අද research සහ generative AI වල ප්‍රධාන framework එක. Hugging Face transformers, diffusers, NeMo, LLaVA, Stable Diffusion code හැම එකක්ම වගේ PyTorch. TensorFlow (Google): Keras high-level API එක, TF Serving, TFLite / LiteRT (mobile සහ edge) වගේ deployment tools ශක්තිමත්. TF 2 එකත් default eager, tf.function වලින් graph කරනවා. Exam එකට මතක තියාගන්න: concepts (tensors, autograd, layers, optimizers) දෙකේම එකයි, syntax විතරයි වෙනස්. JAX තව framework එකක්.',
        'NVIDIA NeMo: generative AI models build, customize, deploy කරන NVIDIA framework එක (PyTorch මත). LLMs වලට අමතරව speech (ASR models: Conformer, Parakeet; TTS: FastPitch, HiFi-GAN) සහ multimodal (vision-language models, NeMo Curator වලින් image/video data curation) support කරනවා. Pretrained checkpoints NGC එකෙන් ගන්න පුළුවන්. Multi-GPU, mixed precision, model parallelism built-in. NeMo Guardrails වෙනම toolkit එකක්, LLM apps වලට safety rules දානවා.',
        'Triton Inference Server: models production එකේ serve කරන open-source server එක. PyTorch (TorchScript), TensorFlow, ONNX, TensorRT, Python backends support කරනවා, ඒ නිසා එකම server එකක වෙනස් frameworks වල models තියාගන්න පුළුවන්. Multimodal pipelines වලට වැදගත් features: Ensemble models (preprocess → encoder → LLM → postprocess වගේ steps DAG එකක් විදිහට server එක ඇතුළේම සම්බන්ධ කරන එක, data network එකෙන් එහා මෙහා යන්නේ නෑ), BLS (Business Logic Scripting: Python එකෙන් loops/conditions, උදා: diffusion loop එක), dynamic batching (requests එකතු කරලා GPU එක පිරෙන්න), concurrent model execution (එකම GPU එකක models කිහිපයක්). HTTP/gRPC endpoints, Prometheus metrics.',
        'Prompt engineering for image models (නැවත සිහිපත් කිරීම): Subject + details + style + lighting + composition + quality. Weighting syntax, negative prompts, seeds. VLMs වලට prompt: image එක මුලින් දීලා, පැහැදිලි ප්‍රශ්නයක්, output format එක (JSON) කියන්න, "image එකේ නැති දේ කියන්න එපා" කියන්න (hallucination අඩු කරන්න).',
      ],
      analogy: 'PyTorch vs TensorFlow = Toyota vs Honda. දෙකම car, steering, brake එකම විදිහටයි. Controls ටිකක් වෙනස්. Triton = ලොකු hotel kitchen එකක head chef. Chefs ලා (models) වෙනස් රටවල (frameworks) අය වුණත්, order එක (request) station එකෙන් station එකට (ensemble) යවනවා, orders එකට එකතු කරලා (dynamic batching) එක වර උයනවා.',
      example: 'Receipt Q&A service එකක් Triton එකේ ensemble එකක් විදිහට: (1) Python backend: image resize + normalize. (2) TensorRT: vision encoder. (3) TensorRT-LLM backend: LLM එක answer generate කරනවා. (4) Python backend: JSON format කරනවා. Dynamic batching max_queue_delay 5 ms නම් ඒ කාලය ඇතුළත එන requests එකට batch වෙනවා. තත්පරයට requests 20ක් එනවා නම් batch ~4-8 දක්වා එකතු වෙලා GPU throughput එක වැඩි වෙනවා.',
      keyPoints: [
        'PyTorch = eager, research/GenAI ප්‍රධාන. TensorFlow = Keras, TF Serving, mobile deployment. Concepts එකයි.',
        'NeMo = NVIDIA GenAI framework: LLM, speech (ASR/TTS), multimodal, data curation.',
        'Triton = multi-framework serving. Ensembles, BLS, dynamic batching, concurrent execution.',
        'Image prompt = subject + style + lighting + composition + negative prompt.',
      ],
      terms: [
        { en: 'Eager Execution', si: 'Code line එකින් line එක ගණනය කරන ක්‍රමය. Debug කරන්න ලේසියි.' },
        { en: 'NeMo', si: 'LLMs, speech, multimodal models build/customize කරන NVIDIA framework එක.' },
        { en: 'NeMo Curator', si: 'Text, image, video datasets ලොකු පරිමාණයෙන් clean/filter කරන NeMo tool එක.' },
        { en: 'Triton Inference Server', si: 'Frameworks කිහිපයක models GPU මත serve කරන NVIDIA open-source server එක.' },
        { en: 'Ensemble Model (Triton)', si: 'Models/steps කිහිපයක් pipeline එකක් විදිහට server එක ඇතුළේ සම්බන්ධ කරන එක.' },
        { en: 'BLS (Business Logic Scripting)', si: 'Triton Python backend එකේ loops, conditions එක්ක models call කරන ක්‍රමය.' },
        { en: 'Dynamic Batching', si: 'වෙන වෙනම එන requests කෙටි කාලයක් ඇතුළත එකට batch කරන Triton feature එක.' },
      ],
    },
    // 17
    {
      id: 'multimodal-evaluation',
      title: 'Multimodal Evaluation: FID, CLIP Score සහ Human Evaluation',
      body: [
        'Generated images "හොඳද" කියලා මනින එක අමාරුයි, එකම හරි උත්තරයක් නැති නිසා. FID (Fréchet Inception Distance): real images set එකක් සහ generated images set එකක් Inception-v3 network එකකින් features (2048-dim) කරලා, ඒ distributions දෙක අතර දුර මනිනවා (Phase 16). අඩු FID = generated images real ඒවට සමානයි, quality සහ diversity දෙකම. FID එකට images දහස් ගණනක් ඕනේ (බොහෝ විට 10,000-50,000), පොඩි sets වල FID විශ්වාස කරන්න බෑ. FID එක prompt එකට ගැළපෙනවද කියලා බලන්නේ නෑ.',
        'CLIP score: generate කරපු image එකයි prompt එකයි CLIP එකෙන් embed කරලා cosine similarity එක (බොහෝ විට 100 න් ගුණ කරලා). වැඩි = prompt එකට ගැළපෙනවා (text-image alignment). ඒත් CLIP එකට ගණන් කිරීම ("කුරුල්ලෝ 3") සහ ස්ථාන ("වම් පැත්තේ") දුර්වලයි. ඉතින් FID = realism/diversity, CLIP score = prompt adherence. දෙකම එකට බලන්න. Inception Score (IS) පරණ metric එකක්. Captioning වලට BLEU, CIDEr, ASR වලට WER, TTS වලට MOS.',
        'Human evaluation තමයි අවසාන විනිසුරුවා. Side-by-side preference (A ද B ද හොඳ?), Likert scale (1-5) ratings: realism, prompt adherence, aesthetics, artifacts (ඇඟිලි 6ක්, විකෘති අකුරු). TTS වලට MOS (Mean Opinion Score, 1-5). Raters කිහිපදෙනෙක්, පැහැදිලි guidelines, rater agreement මනින්න. VLMs වලට benchmarks (VQA, OCR, chart QA) සහ LLM-as-judge.',
      ],
      analogy: 'Vesak pandal තරඟයක්. FID = විනිසුරුවෝ pandals 100ම බලලා "මේ අවුරුද්දේ pandals සාමාන්‍යයෙන් ඇත්ත සම්ප්‍රදායික pandals වලට කොච්චර සමානද" කියලා බලනවා. CLIP score = හැම pandal එකක්ම ඒකේ "තේමා කතාවට" (prompt) ගැළපෙනවද බලනවා. Human eval = ජනතාව ඇවිත් ඡන්දය දෙනවා. තුනම ඕනේ.',
      example: 'Model A: FID 12.5, CLIP score 31.0. Model B: FID 9.8, CLIP score 27.5. B images වඩා real (FID අඩුයි), ඒත් A prompt එකට වඩා ගැළපෙනවා (CLIP score වැඩියි). Human eval: prompts 200ක් side-by-side, raters 3 බැගින්. A ට 58% preference. Product එක prompt adherence එකට වැදගත් නම් A තෝරනවා. Seed, steps, guidance scale එකම තියාගෙන සසඳන්න, නැත්නම් සාධාරණ නෑ.',
      keyPoints: [
        'FID = Inception features distributions දෙකක දුර. අඩු = හොඳ. Images දහස් ගණනක් ඕනේ.',
        'CLIP score = image-prompt cosine similarity. වැඩි = prompt එකට ගැළපෙනවා.',
        'FID (realism/diversity) සහ CLIP score (alignment) දෙකම එකට.',
        'Human eval: side-by-side, Likert, MOS. Settings එකම තියාගෙන සසඳන්න.',
      ],
      terms: [
        { en: 'FID', si: 'Real සහ generated images වල Inception feature distributions අතර දුර. අඩු = හොඳ.' },
        { en: 'CLIP Score', si: 'Generated image එකයි prompt එකයි අතර CLIP cosine similarity. වැඩි = හොඳ.' },
        { en: 'Inception Score (IS)', si: 'Images පැහැදිලිද, විවිධද කියන පරණ metric එක. Real images එක්ක සසඳන්නේ නෑ.' },
        { en: 'MOS (Mean Opinion Score)', si: 'මිනිසුන් 1-5 දක්වා දෙන ලකුණු වල සාමාන්‍යය (TTS, audio quality).' },
        { en: 'Side-by-side Evaluation', si: 'Outputs දෙකක් එකට පෙන්නලා හොඳ එක තෝරන්න කියන human eval ක්‍රමය.' },
      ],
    },
    // 18
    {
      id: 'trustworthy-multimodal',
      title: 'Trustworthy Multimodal AI: Ethics, Privacy, Consent, Deepfakes සහ Bias',
      body: [
        'Images, voice සහ video කියන්නේ පුද්ගලික දත්ත. මූණක් හෝ කටහඬක් biometric data, කෙනෙක්ව හඳුනාගන්න පුළුවන්. Training data වලට කෙනෙක්ගේ photos/voice ගන්න කලින් consent (කැමැත්ත) ගන්න, ඇයි පාවිච්චි කරන්නේ කියලා කියන්න, ඉල්ලුවොත් අයින් කරන්න (opt-out). ශ්‍රී ලංකාවේ Personal Data Protection Act (2022 අංක 9) සහ යුරෝපයේ GDPR වගේ නීති තියෙනවා. Datasets වල මූණු, vehicle number plates, NIC numbers blur කරන්න. Copyright තියෙන කලා කෘති ගැනත් සැලකිලිමත් වෙන්න.',
        'Deepfakes සහ voice cloning: ඇත්ත නොවන video/audio වලින් දේශපාලනඥයෙක් නොකියපු දෙයක් කියවන එක, bank එකට call කරලා voice clone එකකින් වංචා කරන එක, කෙනෙක්ගේ කැමැත්ත නැතුව අසභ්‍ය images හදන එක. ආරක්ෂක ක්‍රම: invisible watermarks (උදා: Google SynthID), C2PA content credentials (image එක කොහෙන් ආවද කියන signed metadata), deepfake detectors, voice cloning වලට කටහඬේ අයිතිකාරයාගේ verified consent, safety classifiers සහ prompt filters.',
        'Bias in image generation: training data internet එකෙන් එන නිසා stereotypes ඉගෙන ගන්නවා. "a doctor" prompt එකට ගොඩක් වෙලාවට පිරිමි, සුදු සමක් තියෙන අය. "a nurse" ට කාන්තාවන්. Sri Lankan, දකුණු ආසියානු මූණු, ඇඳුම්, පරිසර අඩුවෙන් නියෝජනය වෙනවා, නැත්නම් stereotypes විදිහට. ASR models සිංහල, දෙමළ, ප්‍රාදේශීය උච්චාරණ වලට වැඩිපුර වැරදි කරනවා. අඩු කරන ක්‍රම: dataset audit (demographics), balanced/diverse data, fairness evaluation (group අනුව metrics), red-teaming, human review.',
        'Trustworthy AI principles (NVIDIA ද අවධාරණය කරන): privacy, safety and security, transparency (model cards, data sources කියන්න), non-discrimination (fairness), accountability. NeMo Guardrails, safety checkers, content moderation models production pipeline එකේ කොටසක් විදිහට දාන්න.',
      ],
      analogy: 'Wedding photographer කෙනෙක් ඔයාගේ wedding photos ඔයාගෙන් අහන්නේ නැතුව advertising එකකට දැම්මොත් ඒක වැරදියි. AI training data වලටත් ඒකමයි. Deepfake එක = කෙනෙක්ගේ අත්සන ව්‍යාජ විදිහට ගහන එක වගේ. Watermark/C2PA = රුපියල් නෝට්ටුවේ තියෙන ආරක්ෂක නූල, ඇත්තද ව්‍යාජද කියලා බලන්න.',
      example: 'Image model එකකට "a Sri Lankan software engineer" prompt එකෙන් images 100ක් හැදුවා. Audit: 92ක් පිරිමි, 8ක් ගැහැණු. ඇත්ත industry එකේ අනුපාතය එහෙම නෑ. Fix: prompt augmentation (ලිංගිකත්වය, වයස විවිධ කරන්න), fine-tuning data balance කිරීම, නැවත audit. Voice bot එකකට: හඬ නළුවාගෙන් ලිඛිත consent, කාලය සහ භාවිතය සීමා කරලා, හැම generated audio එකකම watermark එකක්.',
      keyPoints: [
        'Faces/voice = biometric පුද්ගලික දත්ත. Consent, opt-out, blur, PDPA/GDPR.',
        'Deepfakes/voice cloning: watermarks (SynthID), C2PA, detectors, verified consent.',
        'Image generation bias: stereotypes, අඩු නියෝජනය. Audit, balanced data, red-teaming.',
        'Transparency (model cards), safety filters, NeMo Guardrails, human review.',
      ],
      terms: [
        { en: 'Deepfake', si: 'AI වලින් හදපු, ඇත්ත වගේ පේන ව්‍යාජ video, image හෝ audio.' },
        { en: 'Consent', si: 'කෙනෙක්ගේ දත්ත පාවිච්චි කරන්න ඔවුන්ගෙන් පැහැදිලිව ලබාගත් කැමැත්ත.' },
        { en: 'C2PA', si: 'Media එකේ මූලාශ්‍රය සහ edit ඉතිහාසය signed metadata විදිහට තියන content credentials standard එක.' },
        { en: 'Watermarking (AI)', si: 'AI-generated content හඳුනාගන්න නොපෙනෙන සලකුණක් ඇතුළත් කරන එක.' },
        { en: 'Representation Bias', si: 'සමහර කණ්ඩායම් data වල අඩුවෙන් හෝ stereotype විදිහට පෙන්නන එක.' },
        { en: 'Red-teaming', si: 'Model එකේ හානිකර outputs හොයන්න හිතාමතාම අමාරු prompts දීලා test කරන එක.' },
      ],
    },
    // 19 (AND MORE)
    {
      id: 'sinhala-receipt-app',
      title: 'And More: Sinhala/English Multimodal App එකක් මුල සිට අග දක්වා',
      body: [
        'අදහස: "බිල්පත් සහායකයා". User කෙනෙක් Keells/Cargills receipt එකක, CEB/Water bill එකක, හෝ සිංහල/English ලේඛනයක photo එකක් ගන්නවා. ඊට පස්සේ සිංහලෙන් හෝ English වලින් (type කරලා හෝ කතා කරලා) අහනවා: "මේ මාසේ කරන්ට් බිල කීයද?", "එළවළු වලට කොච්චර වියදම් කළාද?". App එක සිංහලෙන් උත්තර දෙනවා, අවශ්‍ය නම් කටහඬින්.',
        'Components: (1) Capture + preprocessing: deskew, crop, contrast වැඩි කිරීම, resolution normalize. (2) Understanding: OCR (Tesseract එකේ සිංහල "sin" model එකක් තියෙනවා) + LLM, නැත්නම් කෙලින්ම VLM එකක් ("මේ receipt එකෙන් items, prices, total, date JSON එකක් කරන්න"). (3) Validation: items එකතුව total එකට සමානද, date format හරිද. (4) Storage: JSON database එකකට + text/caption embeddings vector DB එකකට (Milvus/pgvector), user ID metadata එක්ක. (5) Q&A: multimodal RAG: ප්‍රශ්නය embed කරලා අදාළ receipts retrieve කරලා LLM එකට දීලා සිංහලෙන් උත්තරය. ගණන් (එකතු කිරීම්) LLM එකට දෙන්නේ නැතුව Python tool එකකින් කරන්න.',
        '(6) Voice (optional): Whisper ASR (සිංහල) → LLM → සිංහල TTS. (7) Serving: Triton ensemble එකක් හෝ NIM microservices, GPU එකක. (8) Guardrails + privacy: receipts වල නම්, card numbers, ලිපිනයන් තියෙනවා. PII mask කරන්න, encrypt කරන්න, user consent, data delete කරන්න option එකක්. (9) Evaluation: receipts 200ක test set එකක් අතින් label කරලා field accuracy (total හරිද?), Sinhala ASR WER, Q&A accuracy, latency මනින්න.',
      ],
      analogy: 'මේක ගෙදර "ගණන් හිලව් බලන නැන්දා" කෙනෙක් වගේ. බිල්පත් ටික එකතු කරලා file එකකට දානවා (storage). ඔයා අහපු ගමන් අදාළ බිල්පත් ටික අරන් (retrieval) ගණන් හදලා (tool) සිංහලෙන් කියනවා (generation). කාටවත් ඒ බිල්පත් පෙන්නන්නේ නෑ (privacy).',
      example: 'User ගේ receipts 30ක් තියෙනවා. ප්‍රශ්නය: "ජූලි මාසේ supermarket වලට කීයක් ගියාද?" → date filter (ජූලි) + vector search ("supermarket") → receipts 6ක්: Rs. 4,250 + 3,180 + 6,720 + 2,940 + 5,105 + 3,805. Python tool එකෙන් එකතුව Rs. 26,000. LLM උත්තරය: "ජූලි මාසේ supermarket වලට ඔයා රුපියල් 26,000ක් වියදම් කළා. ලොකුම බිල ජූලි 14 Rs. 6,720." Latency target: VLM extraction තත්පර 3ට අඩුවෙන්, Q&A තත්පර 2ට අඩුවෙන්.',
      keyPoints: [
        'Pipeline: photo → preprocess → OCR/VLM → JSON validate → DB + vector DB → RAG Q&A → (TTS).',
        'ගණන් හැදීම tool එකකින්, LLM එකෙන් නෙවෙයි.',
        'Sinhala support: Tesseract "sin", Whisper සිංහල, සිංහල TTS. Quality test කරන්න.',
        'Privacy: PII mask, encryption, consent, delete option.',
        'Serving: Triton ensemble / NIM. Eval: field accuracy, WER, latency.',
      ],
      terms: [
        { en: 'Document AI', si: 'Receipts, forms, invoices වලින් structured data extract කරන AI.' },
        { en: 'Deskew', si: 'ඇල වෙලා ගත්ත document photo එකක් කෙලින් කරන preprocessing පියවර.' },
        { en: 'Structured Extraction', si: 'Image/text එකකින් JSON වගේ නියමිත format එකකට fields ගන්න එක.' },
        { en: 'Tool Calling', si: 'ගණන් වගේ දේවල් LLM එක තමන්ම නොකර code function එකකට යවන එක.' },
        { en: 'NIM', si: 'NVIDIA Inference Microservices. Optimized models ready-to-run containers විදිහට.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Whisper වගේ ASR model එකකට audio දෙන්න කලින් සාමාන්‍යයෙන් කරන්නේ මොකක්ද?',
      options: [
        'Audio එක 16×16 pixel patches වලට කපන එක',
        'Audio එක 16 kHz වලට resample කරලා log-Mel spectrogram එකක් කරන එක',
        'Audio එක CLIP text encoder එකට දෙන එක',
        'Audio එක VAE එකකින් 512×512 image එකක් කරන එක',
      ],
      answer: 1,
      why: 'Whisper audio එක 16 kHz කරලා, තත්පර 30 කොටස් log-Mel spectrogram කරලා encoder එකට දෙනවා.',
    },
    {
      q: 'Search කරන්න කලින්ම images මිලියනයක් index කරලා තියාගන්න පුළුවන්, වේගවත්ම architecture එක කොයිද?',
      options: [
        'Dual encoder (CLIP වගේ)',
        'Early fusion VLM එකක්',
        'Diffusion U-Net එකක්',
        'Text-to-speech model එකක්',
      ],
      answer: 0,
      why: 'Dual encoder එකේ image සහ text වෙන වෙනම embed වෙන නිසා images කලින්ම embed කරලා vector DB එකක තියාගන්න පුළුවන්.',
    },
    {
      q: 'CLIP train කරන්න පාවිච්චි කරන loss එක මොකක්ද?',
      options: [
        'Pixels අතර MSE reconstruction loss',
        'Diffusion noise-prediction loss',
        'N×N similarity matrix එකේ symmetric contrastive (InfoNCE) cross-entropy',
        'CTC loss',
      ],
      answer: 2,
      why: 'CLIP හරි image-text pairs (diagonal) ඉහළට, අනිත් negatives පහළට තල්ලු කරන symmetric contrastive loss එකක් පාවිච්චි කරනවා.',
    },
    {
      q: 'Residual connections ගැඹුරු networks train කරන්න උදව් වෙන ප්‍රධාන හේතුව කුමක්ද?',
      options: [
        'Parameters ගණන බාගයකින් අඩු කරන නිසා',
        'Gradients වලට layers පනින කෙටි පාරක් දෙන නිසා vanishing gradients අඩු වෙනවා',
        'Learning rate warmup අනවශ්‍ය කරන නිසා',
        'Model එක FP16 වලට auto convert කරන නිසා',
      ],
      answer: 1,
      why: 'x + f(x) නිසා backpropagation වලදී gradient එකට identity පාරක් තියෙනවා, ගැඹුරු networks වලත් gradients ගලනවා.',
    },
    {
      q: 'U-Net එකේ skip connections වල කාර්යය කුමක්ද?',
      options: [
        'Encoder එකේ සියුම් spatial විස්තර එම size එකේ decoder level එකට ගෙනියන එක',
        'Text prompt එක image එකට එකතු කරන එක',
        'Model එක වේගවත් කරන්න layers අයින් කරන එක',
        'Noise schedule එක තීරණය කරන එක',
      ],
      answer: 0,
      why: 'Downsampling වලදී නැති වෙන edges, textures, ස්ථාන තොරතුරු skip connections හරහා decoder එකට concatenate වෙනවා.',
    },
    {
      q: 'Stable Diffusion text-to-image pipeline එකේ නිවැරදි පිළිවෙළ කුමක්ද?',
      options: [
        'VAE decoder → text encoder → U-Net',
        'U-Net → text encoder → VAE encoder',
        'Text encoder → U-Net denoising loop (scheduler එක්ක) → VAE decoder',
        'Text encoder → VAE decoder → U-Net',
      ],
      answer: 2,
      why: 'Prompt එක embed කරනවා, latent space එකේ noise ටිකෙන් ටික අයින් කරනවා, අන්තිමට VAE decoder එකෙන් pixels කරනවා.',
    },
    {
      q: 'Negative prompt එක ඇත්තටම වැඩ කරන්නේ කොහොමද?',
      options: [
        'Generate වුණාට පස්සේ image එකෙන් ඒ objects මකනවා',
        'Classifier-free guidance එකේ unconditional (හිස්) prompt එක වෙනුවට පාවිච්චි වෙලා, guidance එක ඒ දේවල් වලින් ඈතට තල්ලු කරනවා',
        'Training data වලින් ඒ වචන අයින් කරනවා',
        'Denoising steps ගණන අඩු කරනවා',
      ],
      answer: 1,
      why: 'CFG = uncond + w(cond − uncond). Negative prompt එක uncond පැත්ත වෙන නිසා output එක ඒකෙන් ඈතට යනවා.',
    },
    {
      q: 'Model A: FID 9, CLIP score 26. Model B: FID 14, CLIP score 32. කොයි ප්‍රකාශය හරිද?',
      options: [
        'A වඩා real images හදනවා, B prompt එකට වඩා ගැළපෙනවා',
        'B සෑම අතින්ම හොඳයි, FID වැඩි නිසා',
        'A සෑම අතින්ම හොඳයි, CLIP score අඩු නිසා',
        'FID සහ CLIP score එකම දේ මනිනවා',
      ],
      answer: 0,
      why: 'FID අඩු = realism/diversity හොඳයි (A). CLIP score වැඩි = prompt alignment හොඳයි (B).',
    },
    {
      q: 'Multimodal pipeline එකක preprocess → vision encoder → LLM → postprocess steps එකම server එකක් ඇතුළේ සම්බන්ධ කරන්න Triton එකේ පාවිච්චි කරන feature එක කුමක්ද?',
      options: [
        'Gradient checkpointing',
        'Ensemble models (හෝ BLS)',
        'LoRA adapters',
        'Aspect ratio bucketing',
      ],
      answer: 1,
      why: 'Triton ensembles සහ BLS models/steps කිහිපයක් server එක ඇතුළේම pipeline එකක් විදිහට සම්බන්ධ කරනවා.',
    },
    {
      q: 'Web වලින් ගත්ත image-caption pairs වල caption එක image එකට ඇත්තටම ගැළපෙනවද කියලා ලොකු පරිමාණයෙන් පරීක්ෂා කරන පොදු ක්‍රමය කුමක්ද?',
      options: [
        'හැම image එකකම resolution එක 4K කරන එක',
        'CLIP similarity එක ගණනය කරලා threshold එකකට අඩු pairs අයින් කරන එක',
        'Captions සියල්ල NLTK stemming කරන එක',
        'Images grayscale කරන එක',
      ],
      answer: 1,
      why: 'LAION වගේ datasets CLIP image-text similarity threshold එකකින් නොගැළපෙන pairs filter කළා. ඒක cross-modal alignment check එකක්.',
    },
  ],
}
