export default {
  id: 'advanced',
  number: 8,
  title: 'Advanced: Hero Level',
  titleSi: 'Hero Level: AI එක ඇතුළටම, research ලෝකයටම',
  summary:
    'මේ phase එකේ තියෙන්නේ AI ලෝකයේ ඉහළම මට්ටමේ මාතෘකා: games සහ robots ඉගෙන ගන්න reinforcement learning, GPT එකක් මුල ඉඳන්ම හදන හැටි, models සිය ගණනක GPUs වල train කරන හැටි, models ඇතුළේ මොකද වෙන්නේ කියලා බලන interpretability, සහ AI ආරක්ෂිතව, සාධාරණව භාවිතා කරන හැටි. අන්තිමට ඔයාට zero ඉඳන් hero වෙන්න projects පෙළක් සහ නොමිලේ resources ලැයිස්තුවක් තියෙනවා.',
  duration: 'සති 8-12 (ඊට පස්සෙත් ජීවිත කාලයක්ම)',
  topics: [
    {
      id: 'rl-basics',
      title: 'Reinforcement Learning Basics (MDP, Q-learning)',
      body: [
        'අපි කලින් ඉගෙන ගත්ත supervised learning වල හැම example එකකටම හරි උත්තරය (label) තිබුණා. Reinforcement Learning (RL) වල එහෙම නෑ. Agent කෙනෙක් environment එකක ක්‍රියා (actions) කරනවා. හොඳ දෙයක් කරාම reward එකක් ලැබෙනවා, නරක දෙයක් කරාම penalty එකක් (negative reward) ලැබෙනවා. Trial and error වලින් agent ඉගෙන ගන්නවා මුළු කාලය පුරාම ලැබෙන rewards වැඩිම කරන්නේ කොහොමද කියලා.',
        'මේ ප්‍රශ්නය ලියන සම්මත ක්‍රමය MDP (Markov Decision Process). ඒකේ කොටස් පහක් තියෙනවා: states (දැන් ඉන්න තත්ත්වය, උදා: robot ඉන්න තැන), actions (කරන්න පුළුවන් දේවල්, උදා: වමට, දකුණට), transitions (action එකකින් පස්සේ ඊළඟට යන state එක), rewards, සහ discount factor (γ, gamma). "Markov" කියන්නේ ඊළඟට මොකද වෙන්නේ කියන එක රඳා පවතින්නේ දැන් state එක සහ action එක මත විතරයි, කලින් ඉතිහාසය මත නෙවෙයි කියන උපකල්පනය.',
        'Discount factor එක (0ත් 1ත් අතර අංකයක්, උදා: 0.9) කියන්නේ අනාගත rewards වලට දැන් rewards වලට වඩා පොඩ්ඩක් අඩු වටිනාකමක් දෙන එක. අද රු. 100ක් හෙට රු. 100කට වඩා වටිනවා වගේ. Agent ඉගෙන ගන්නේ policy එකක්, ඒ කියන්නේ "මේ state එකේදී මේ action එක කරන්න" කියන නීති මාලාව.',
        'Q-learning කියන්නේ සරලම, ප්‍රසිද්ධම RL algorithm එකක්. Q(s, a) කියන්නේ "state s එකේදී action a කරලා, ඊට පස්සේ හොඳම විදිහට හැසිරුණොත් මුළු කාලයේම ලැබෙන reward එක කොච්චරද" කියන අනුමානය. Agent එක හැම පියවරකටම පස්සේ මේ අගය ටිකක් update කරනවා. Exploration (අලුත් දේවල් try කිරීම) සහ exploitation (දැනට දන්න හොඳම දේ කිරීම) අතර සමබරතාවය ඕනේ. ε-greedy ක්‍රමයේදී පොඩි සම්භාවිතාවකින් (උදා: 10%) random action එකක් කරනවා, අනිත් වෙලාවට හොඳම action එක කරනවා.',
      ],
      analogy:
        'බල්ලෙක්ට "වාඩි වෙන්න" කියලා උගන්වනවා හිතන්න. බල්ලාට භාෂාව තේරෙන්නේ නෑ, හරි උත්තරය කියලා දෙන්නත් බෑ. ඒත් වාඩි වුණාම biscuit එකක් (reward) දෙනවා. මුලින් බල්ලා random දේවල් කරනවා. ටික කාලෙකින් ඌ තේරුම් ගන්නවා "මේ වචනය ඇහුණාම වාඩි වුණොත් biscuit එකක් ලැබෙනවා" කියලා. Video game එකක් සෙල්ලම් කරන ළමයෙක් වුණත් එහෙමයි. Manual එක කියවන්නේ නෑ, ගහලා, මැරිලා, ආයෙත් try කරලා score එක වැඩි කරගන්නවා.',
      example:
        'Maze එකක robot කෙනෙක්. දැනට Q(කොරිඩෝව, දකුණට) = 2. Robot දකුණට ගියාම reward 10ක් ලැබුණා, අලුත් state එකේ හොඳම Q අගය 5යි. Learning rate α = 0.1, discount γ = 0.9. ඉලක්කය (target) = 10 + 0.9 × 5 = 14.5. දැන් අගයයි ඉලක්කයයි අතර වෙනස = 14.5 − 2 = 12.5. ඒකෙන් 10%ක් විතරක් එකතු කරනවා: අලුත් Q = 2 + 0.1 × 12.5 = 3.25. මෙහෙම දහස් ගණනක් පාරක් කරාම Q අගයන් හරි අගයන් වලට ළඟා වෙනවා.',
      code: {
        lang: 'python',
        src: `Q = {}                 # (state, action) -> අගය. මුලින් හිස්
alpha, gamma = 0.1, 0.9  # learning rate, discount factor

def update(s, a, reward, s_next, actions):
    old = Q.get((s, a), 0.0)
    # ඊළඟ state එකේ කරන්න පුළුවන් හොඳම action එකේ අගය
    best_next = max(Q.get((s_next, b), 0.0) for b in actions)
    target = reward + gamma * best_next     # "ඇත්තටම මෙච්චර වටිනවා" කියන අනුමානය
    Q[(s, a)] = old + alpha * (target - old)  # ටිකක් විතරක් ඒ දිහාවට යනවා

Q[("corridor", "right")] = 2.0
update("corridor", "right", 10, "room", ["left", "right"])
print(Q[("corridor", "right")])   # 2.0 -> 2.0 + 0.1 * (10 - 2) = 2.8 (room එකේ Q තාම 0)`,
      },
      keyPoints: [
        'RL = labels නැතුව, rewards වලින් trial and error කරලා ඉගෙන ගන්න එක.',
        'MDP = states, actions, transitions, rewards, discount factor.',
        'Policy = හැම state එකකදීම කරන්න ඕනේ action එක කියන නීතිය.',
        'Q-learning = state-action යුගලයක දිගුකාලීන වටිනාකම ටික ටික update කරන ක්‍රමය.',
        'Exploration සහ exploitation අතර සමබරතාවය ඕනේ.',
      ],
      terms: [
        { en: 'Agent', si: 'තීරණ ගන්න, ඉගෙන ගන්න කෙනා. උදා: robot, game player.' },
        { en: 'Environment', si: 'Agent ක්‍රියා කරන ලෝකය. උදා: game එක, maze එක.' },
        { en: 'Reward', si: 'Action එකකට පස්සේ ලැබෙන හොඳ හෝ නරක ලකුණු.' },
        { en: 'MDP (Markov Decision Process)', si: 'States, actions, transitions, rewards වලින් RL ප්‍රශ්නයක් ලියන ගණිතමය රාමුව.' },
        { en: 'Policy', si: 'State එකක් දුන්නාම action එක තෝරන නීතිය.' },
        { en: 'Discount Factor (γ)', si: 'අනාගත rewards වලට කොච්චර වටිනාකමක් දෙනවද කියන 0-1 අතර අංකය.' },
        { en: 'Q-learning', si: 'Q(s, a) අගයන් ඉගෙන ගෙන හොඳම action එක තෝරන algorithm එක.' },
        { en: 'Exploration vs Exploitation', si: 'අලුත් දේවල් try කරනවද, දැනට දන්න හොඳම දේ කරනවද කියන තේරීම.' },
        { en: 'ε-greedy', si: 'පොඩි සම්භාවිතාවකින් random action එකක් කරන exploration ක්‍රමය.' },
      ],
    },
    {
      id: 'deep-rl',
      title: 'Deep RL (DQN, Policy Gradients, Actor-Critic, PPO)',
      body: [
        'Maze එකක states 100ක් තියෙනවා නම් Q අගයන් table එකක තියාගන්න පුළුවන්. ඒත් Atari game screen එකක pixels ලක්ෂ ගණනක් තියෙනවා. හැකි states ගණන විශ්වයේ පරමාණු ගණනටත් වඩා වැඩියි. Table එකක් හදන්න බෑ. ඒකට DQN (Deep Q-Network) Q table එක වෙනුවට neural network එකක් භාවිතා කරනවා. Screen එක input එක, හැම action එකකටම Q අගය output එක. 2015 දී DeepMind DQN එකෙන් Atari games ගොඩක මිනිස් මට්ටමේ score ගත්තා. Training ස්ථාවර කරන්න experience replay (පරණ අත්දැකීම් ගබඩා කරලා random විදිහට නැවත ඉගෙන ගන්න එක) සහ target network (හෙමින් update වෙන දෙවෙනි copy එකක්) කියන උපක්‍රම දෙක භාවිතා කළා.',
        'Policy gradient ක්‍රම වෙනස් විදිහකට හිතනවා. Q අගයන් ඉගෙන ගන්නේ නැතුව, policy එකම (හැම action එකකටම සම්භාවිතාවක් දෙන network එකක්) කෙලින්ම ඉගෙන ගන්නවා. හොඳ reward එකක් ලැබුණු episode එකක කරපු actions වල සම්භාවිතාව වැඩි කරනවා, නරක ඒවායේ අඩු කරනවා. REINFORCE කියන්නේ සරලම policy gradient algorithm එක. Robot arm එකක් වගේ actions අඛණ්ඩ (continuous) වෙන තැන් වලට මේ ක්‍රම හොඳයි.',
        'Actor-critic ක්‍රම දෙකම එකතු කරනවා. Actor (policy network) action එක තෝරනවා. Critic (value network) "මේ තත්ත්වය කොච්චර හොඳද" කියලා අනුමාන කරනවා. Critic ගෙ අදහස් වලින් actor ගෙ ඉගෙනීම වඩා ස්ථාවර වෙනවා, මොකද reward එක "බලාපොරොත්තු වුණාට වඩා හොඳද නරකද" (advantage) කියලා බලන්න පුළුවන්.',
        'PPO (Proximal Policy Optimization, OpenAI, 2017) කියන්නේ අද ගොඩක්ම භාවිතා වෙන actor-critic algorithm එකක්. ඒකේ ප්‍රධාන අදහස: එක update එකකදී policy එක ගොඩක් වෙනස් වෙන්න දෙන්නේ නෑ (clipping). ඒ නිසා training එක කඩාවැටෙන්නේ නෑ. ChatGPT වගේ LLMs මිනිස් කැමැත්තට ගැලපෙන්න හදන RLHF (Reinforcement Learning from Human Feedback) වල සම්භාව්‍ය ක්‍රමය PPO. අද DPO, GRPO වගේ වෙනත් ක්‍රමත් ජනප්‍රියයි.',
      ],
      analogy:
        'Cricket batsman කෙනෙක් හිතන්න. Actor කියන්නේ batsman. ඔහු shot එක තෝරනවා. Critic කියන්නේ coach. "ඒ බෝලෙට ඒ shot එක හොඳයි, ඒත් මේ බෝලෙට අවදානම්" කියලා අදහස් දෙනවා. PPO කියන්නේ coach "එක දවසකින් ඔයාගේ batting style එක සම්පූර්ණයෙන්ම වෙනස් කරන්න එපා, ටික ටික වෙනස් කරන්න" කියනවා වගේ. එකපාරටම ලොකු වෙනස් කරොත් තිබුණු හොඳ දේවලුත් නැති වෙනවා.',
      example:
        'Robot vacuum cleaner එකක් ගෙයක් පිරිසිදු කරන්න ඉගෙන ගන්නවා. Reward: දූවිලි තියෙන තැනක් clean කරාම +1, බිත්තියක හැප්පුණාම −5, battery ඉවර වෙන්න කලින් charger එකට ආවාම +10. Camera image එක input එක නිසා table එකක් හදන්න බෑ, ඒ නිසා neural network එකක් ඕනේ. PPO එකෙන් episodes දහස් ගණනක් simulate කරලා train කරාම, robot ඉගෙන ගන්නවා කාමරේ කොන් වලට යන්න, battery 20%ට අඩු වුණාම charger එකට ආපහු යන්න.',
      keyPoints: [
        'DQN = Q table එක වෙනුවට neural network එකක්. Experience replay සහ target network ඕනේ.',
        'Policy gradient = policy එකම කෙලින්ම ඉගෙන ගන්නවා.',
        'Actor-critic = actor action තෝරනවා, critic ඒක කොච්චර හොඳද කියලා අනුමාන කරනවා.',
        'PPO = policy එක එක පාරකට ගොඩක් වෙනස් වෙන්න නොදෙන ස්ථාවර algorithm එක. RLHF වල භාවිතා වෙනවා.',
      ],
      terms: [
        { en: 'DQN (Deep Q-Network)', si: 'Q අගයන් අනුමාන කරන්න neural network එකක් භාවිතා කරන ක්‍රමය.' },
        { en: 'Experience Replay', si: 'පරණ අත්දැකීම් buffer එකක තියලා random විදිහට නැවත ඉගෙන ගන්න එක.' },
        { en: 'Target Network', si: 'Training ස්ථාවර කරන්න හෙමින් update කරන Q-network එකේ copy එක.' },
        { en: 'Policy Gradient', si: 'Rewards වැඩි වෙන දිශාවට policy network එකේ weights කෙලින්ම update කරන ක්‍රම.' },
        { en: 'REINFORCE', si: 'සරලම policy gradient algorithm එක.' },
        { en: 'Actor-Critic', si: 'Policy (actor) සහ value function (critic) දෙකම එකට ඉගෙන ගන්න ක්‍රමය.' },
        { en: 'Advantage', si: 'Action එකක් සාමාන්‍යයෙන් බලාපොරොත්තු වෙනවාට වඩා කොච්චර හොඳද කියන අගය.' },
        { en: 'PPO', si: 'Proximal Policy Optimization. Clipping වලින් ස්ථාවරව policy එක update කරන algorithm එක.' },
        { en: 'RLHF', si: 'මිනිස් feedback වලින් හදපු reward model එකක් භාවිතා කරලා LLMs RL වලින් tune කරන එක.' },
      ],
    },
    {
      id: 'gpt-from-scratch',
      title: 'Building a Transformer & Small GPT from Scratch (nanoGPT)',
      body: [
        'Libraries භාවිතා කරන එක හොඳයි. ඒත් ඇත්තටම තේරුම් ගන්න හොඳම ක්‍රමය තමන්ම හදන එක. Andrej Karpathy (OpenAI co-founder, කලින් Tesla AI director) "Neural Networks: Zero to Hero" කියන YouTube series එකේ "Let\'s build GPT: from scratch, in code, spelled out" කියන video එකේ PyTorch වලින් පේළි සිය ගණනකින් පොඩි GPT එකක් හදනවා. ඒ code එකේ තරමක් ලොකු, පිරිසිදු version එක nanoGPT කියන GitHub repo එක.',
        'පියවර: (1) Tokenizer: text එක අංක වලට හරවනවා. පටන් ගන්න character-level (හැම අකුරටම අංකයක්) ලේසියි. (2) Embeddings: හැම token එකකටම vector එකක්, ඒ වගේම position embedding එකක් (වචනය තියෙන තැන). (3) Self-attention: හැම token එකක්ම query, key, value කියලා vectors තුනක් හදනවා. Query එක අනිත් tokens වල keys එක්ක ගැලපෙන ප්‍රමාණය බලලා, ඒ අනුව values එකතු කරනවා. (4) Causal mask: GPT එකට අනාගත tokens බලන්න බෑ, කලින් ඒවා විතරයි.',
        '(5) Multi-head attention: attention heads කීපයක් එකවර, එකිනෙකට වෙනස් සම්බන්ධතා බලනවා. (6) Feed-forward layer, residual connections, layer normalization එකතු කරලා Transformer block එකක් හදනවා. (7) Blocks කීපයක් එක උඩ එක තියලා, අන්තිමට ඊළඟ token එකේ සම්භාවිතා දෙන layer එකක්. (8) Loss එක cross-entropy (ඊළඟ token එක හරියට අනුමාන කරාද). Shakespeare text වගේ පොඩි dataset එකක train කරාම, විනාඩි කීපයකින් Shakespeare වගේ පේන (අර්ථයක් නැති) text generate කරනවා.',
        'GPT-2, GPT-4, Claude වගේ ලොකු models වලත් මූලික ව්‍යුහය මේකමයි. වෙනස තියෙන්නේ ප්‍රමාණය (parameters බිලියන ගණන්), data (tokens ට්‍රිලියන ගණන්), සහ pretraining එකෙන් පස්සේ කරන instruction tuning, RLHF වගේ පියවර වල.',
      ],
      analogy:
        'Tuk-tuk එකක් පදවන්න දන්නවා කියන එකයි, engine එක ගලවලා ආයෙත් එකලස් කරන්න දන්නවා කියන එකයි දෙකක්. Hugging Face වලින් model එකක් load කරන එක පදවන එක. nanoGPT හදන එක engine එක ගලවලා, හැම කොටසක්ම මොකක්ද කියලා තේරුම් අරන් ආයෙත් එකලස් කරන එක. ඊට පස්සේ engine එකේ ශබ්දයක් ආවොත් ඔයා දන්නවා මොකද වෙලා තියෙන්නේ කියලා.',
      example:
        'Karpathy ගෙ video එකේ model එක ගොඩක් පොඩියි: layers 6, heads 6, embedding size 384, context length 256. Parameters මිලියන 10ක් විතර. Shakespeare dataset එකේ characters මිලියන 1ක් විතර තියෙනවා. හොඳ GPU එකක විනාඩි 15ක් විතර train කරාම validation loss එක 4.2 (random අනුමාන) ඉඳන් 1.5ට විතර අඩු වෙනවා. Output එක: "KING RICHARD: What say you, my lord?" වගේ Shakespeare style එකේ text.',
      code: {
        lang: 'python',
        src: `import torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)
T, C = 4, 8                       # tokens 4ක්, එක token එකකට numbers 8ක්
x = torch.randn(T, C)             # token embeddings (ඇත්තටම learn කරනවා)
q_proj, k_proj, v_proj = (nn.Linear(C, C, bias=False) for _ in range(3))
q, k, v = q_proj(x), k_proj(x), v_proj(x)
scores = q @ k.T / C ** 0.5       # කවුද කාට කොච්චර ගැලපෙනවද (scaled dot product)
mask = torch.tril(torch.ones(T, T))              # පහළ ත්‍රිකෝණය: කලින් tokens විතරයි
scores = scores.masked_fill(mask == 0, float("-inf"))  # අනාගතය හංගනවා
weights = F.softmax(scores, dim=-1)  # හැම පේළියක්ම එකතුව 1ට එන සම්භාවිතා
out = weights @ v                 # values වල බර තැබූ එකතුව = අලුත් representation
print(weights)                    # පළමු token එකට තමන්වම විතරයි බලන්න පුළුවන්`,
      },
      keyPoints: [
        'GPT = embeddings + Transformer blocks (masked self-attention + feed-forward) + ඊළඟ token prediction.',
        'Query, key, value: query එක keys එක්ක ගලපලා values එකතු කරනවා.',
        'Causal mask එක නිසා GPT එකට අනාගත tokens පේන්නේ නෑ.',
        'Karpathy ගෙ "Let\'s build GPT" video එක සහ nanoGPT repo එක හොඳම ආරම්භය.',
      ],
      terms: [
        { en: 'nanoGPT', si: 'Karpathy ගෙ GPT-2 වගේ models train කරන්න පුළුවන් පොඩි, පිරිසිදු PyTorch repo එක.' },
        { en: 'Self-Attention', si: 'Sequence එකේ හැම token එකක්ම අනිත් tokens බලලා තමන්ගේ අර්ථය update කරගන්න ක්‍රමය.' },
        { en: 'Query / Key / Value', si: 'Attention වලදී: මම හොයන්නේ මොකක්ද / මට තියෙන්නේ මොකක්ද / මම දෙන්නේ මොකක්ද.' },
        { en: 'Causal Mask', si: 'Token එකකට තමන්ට පස්සේ එන tokens බලන්න නොදෙන mask එක.' },
        { en: 'Multi-Head Attention', si: 'Attention heads කීපයක් සමාන්තරව වෙනස් සම්බන්ධතා බලන එක.' },
        { en: 'Positional Embedding', si: 'Token එක sequence එකේ කොතනද කියන තොරතුර.' },
        { en: 'Residual Connection', si: 'Layer එකක input එක output එකට කෙලින්ම එකතු කරන shortcut එක. ගැඹුරු networks train කරන්න උදව් වෙනවා.' },
        { en: 'Layer Normalization', si: 'හැම token එකකම අගයන් ස්ථාවර පරාසයකට ගේන එක.' },
        { en: 'Pretraining', si: 'විශාල text ප්‍රමාණයක ඊළඟ token එක අනුමාන කරන්න model එක මුලින්ම train කරන එක.' },
      ],
    },
    {
      id: 'distributed-training',
      title: 'Distributed Training (Data/Model Parallelism, DeepSpeed, FSDP)',
      body: [
        'Parameters බිලියන 70ක model එකක් 16-bit වලින් තියන්න weights වලට විතරක් GB 140ක් ඕනේ. Training වලට gradients සහ optimizer states (Adam වලට weights වලට වඩා දෙගුණයක් විතර) ඕනේ නිසා ඊටත් වඩා ගොඩක් memory යනවා. ලොකුම GPU එකකටත් ඒක දරාගන්න බෑ. ඒ වගේම එක GPU එකක train කරොත් අවුරුදු ගණනක් යනවා. ඒ නිසා GPUs ගොඩක් එකට වැඩ කරවනවා.',
        'Data parallelism: හැම GPU එකකම model එකේ සම්පූර්ණ copy එකක් තියෙනවා. Data batch එක කොටස් වලට බෙදලා හැම GPU එකකටම වෙනම කොටසක් දෙනවා. හැම GPU එකක්ම gradients ගණනය කරලා, ඒ gradients සාමාන්‍ය කරනවා (all-reduce), ඊට පස්සේ හැමෝම එකම update එක කරනවා. PyTorch වල මේකට DDP (DistributedDataParallel). ප්‍රශ්නය: model එක එක GPU එකකට ගැලපෙන්න ඕනේ.',
        'Model parallelism: model එක GPUs අතර බෙදනවා. Tensor parallelism එකේ එක layer එකක matrix එකම කොටස් වලට කඩලා GPUs කීපයක ගණනය කරනවා. Pipeline parallelism එකේ layers 1-10 GPU 1, 11-20 GPU 2 වගේ බෙදලා, data micro-batches factory assembly line එකක් වගේ ගලාගෙන යනවා. ලොකුම models train කරන්නේ මේ ක්‍රම කීපයක්ම එකට (3D parallelism) භාවිතා කරලා.',
        'DeepSpeed (Microsoft) සහ FSDP (PyTorch Fully Sharded Data Parallel) data parallelism එකේ memory ප්‍රශ්නය විසඳනවා. හැම GPU එකකම සම්පූර්ණ copy එකක් තියාගන්නේ නැතුව, weights, gradients, optimizer states කොටස් (shards) වලට කඩලා GPUs අතර බෙදනවා. Layer එකක් ගණනය කරන්න ඕනේ මොහොතේ විතරක් ඒ layer එකේ සම්පූර්ණ weights GPUs අතර එකතු කරගන්නවා. DeepSpeed එකේ මේ අදහසට ZeRO (Zero Redundancy Optimizer) කියනවා. Stage 1 optimizer states, stage 2 + gradients, stage 3 + weights shard කරනවා. FSDP කියන්නේ PyTorch එකේම ඇති ZeRO stage 3 වගේ ක්‍රමය.',
      ],
      analogy:
        'පොත් 1,000ක් තියෙන library එකක පොත් වලට ලේබල් අලවන්න ඕනේ. Data parallelism = සේවකයෝ 10 දෙනෙක්, හැමෝටම එකම උපදෙස් පොත (model copy එක) දීලා, පොත් 100 බැගින් බෙදනවා. Model parallelism = උපදෙස් පොත එක්කෙනෙක්ට උස්සන්න බැරි තරම් ලොකුයි, ඒ නිසා පිටු 1-50 එක්කෙනෙක්, 51-100 තව කෙනෙක්. FSDP = හැමෝම උපදෙස් පොතෙන් කොටසක් විතරක් තියාගෙන, ඕනේ වෙලාවට අනිත් අයගෙන් ඉල්ලගෙන කියවලා ආපහු දෙනවා.',
      example:
        'බිලියන 7 model එකක් Adam එක්ක mixed precision වලින් train කරද්දී weights, gradients, optimizer states වලට විතරක් parameter එකකට bytes 16ක් විතර යනවා: බිලියන 7 × 16 = GB 112 විතර (activations එකතු නොකර). GB 80 GPU එකකට ඒක ගැලපෙන්නේ නෑ. GPUs 8ක FSDP (full sharding) එකෙන් ඒ GB 112 බෙදුවාම GPU එකකට GB 14ක් විතරයි. දැන් activations වලටත් ඉඩ තියෙනවා.',
      keyPoints: [
        'Data parallelism = හැම GPU එකකම model copy එකක්, data වෙන වෙනම.',
        'Model parallelism = model එකම GPUs අතර බෙදනවා (tensor සහ pipeline).',
        'DeepSpeed ZeRO සහ FSDP = weights, gradients, optimizer states shard කරලා memory ඉතුරු කරනවා.',
        'ලොකු LLMs train කරන්නේ මේ ක්‍රම කීපයක්ම එකට භාවිතා කරලා.',
      ],
      terms: [
        { en: 'Data Parallelism', si: 'එකම model එක GPUs ගොඩක, data වෙන වෙනම කොටස් වලින් train කරන එක.' },
        { en: 'Model Parallelism', si: 'Model එක කොටස් කරලා වෙනස් GPUs වල තියන එක.' },
        { en: 'Tensor Parallelism', si: 'එක layer එකක ගණනය කිරීම් GPUs කීපයක් අතර බෙදන එක.' },
        { en: 'Pipeline Parallelism', si: 'Layers කණ්ඩායම් වෙනස් GPUs වල තියලා micro-batches පෙළට යවන එක.' },
        { en: 'DDP', si: 'PyTorch DistributedDataParallel. සම්මත data parallel training ක්‍රමය.' },
        { en: 'All-Reduce', si: 'හැම GPU එකකම gradients එකතු කරලා සාමාන්‍ය කරලා හැමෝටම බෙදන communication පියවර.' },
        { en: 'DeepSpeed', si: 'ලොකු models train කරන්න Microsoft හදපු optimization library එක.' },
        { en: 'ZeRO', si: 'Zero Redundancy Optimizer. Training states GPUs අතර shard කරලා memory අඩු කරන ක්‍රමය.' },
        { en: 'FSDP', si: 'Fully Sharded Data Parallel. PyTorch එකේ weights, gradients, optimizer states shard කරන ක්‍රමය.' },
        { en: 'Mixed Precision', si: '16-bit සහ 32-bit numbers එකට භාවිතා කරලා වේගය වැඩි කරලා memory අඩු කරන එක.' },
      ],
    },
    {
      id: 'efficient-attention',
      title: 'Flash Attention, Efficient Attention & Mamba',
      body: [
        'සාමාන්‍ය self-attention වල හැම token එකක්ම අනිත් හැම token එකක්ම බලනවා. Tokens n ගණනක් තියෙනවා නම් ගණනය කිරීම් n × n (n²) ප්‍රමාණයක්. Tokens 1,000 නම් scores මිලියනයක්. Tokens 100,000 නම් බිලියන 10ක්. Context එක දෙගුණ කරාම වැඩේ හතර ගුණයක් වෙනවා. දිගු documents වලට මේක ලොකු ප්‍රශ්නයක්.',
        'Flash Attention (Tri Dao සහ සගයන්, 2022) attention වල ගණිතය වෙනස් කරන්නේ නෑ. ප්‍රතිඵලය සම්පූර්ණයෙන්ම එකයි (exact attention). වෙනස තියෙන්නේ GPU memory එක භාවිතා කරන විදිහේ. GPU එකට ලොකු, හෙමින් memory එකක් (HBM) සහ පොඩි, ඉතා වේගවත් memory එකක් (SRAM) තියෙනවා. සාමාන්‍ය attention ලොකු n × n matrix එක HBM එකට ලියලා ආයෙත් කියවනවා. Flash Attention ගණනය කිරීම කුඩා කොටස් (tiles) වලට කඩලා SRAM එක ඇතුළේම කරනවා, ලොකු matrix එක කවදාවත් සම්පූර්ණයෙන් ලියන්නේ නෑ. ප්‍රතිඵලය: වේගය කීප ගුණයකින් වැඩි වෙනවා, memory එක n² නොවී n වලට සමානුපාතික වෙනවා. ගණනය කිරීම් ගණන නම් තවමත් n².',
        'තවත් efficient attention ක්‍රම: Sparse attention (හැම token එකක්ම නෙවෙයි, තෝරාගත් ඒවා විතරක් බලනවා), Sliding window attention (ළඟම tokens කීපයක් විතරක් බලනවා, Mistral වගේ models වල), Linear attention (n² වෙනුවට n වලට සමානුපාතික වෙන්න approximate කරනවා), සහ Grouped-Query Attention / Multi-Query Attention (heads කීපයක් එකම keys සහ values බෙදාගෙන KV cache එක පොඩි කරනවා).',
        'State Space Models (SSMs) attention නැතුවම sequences process කරනවා. ඒවා RNN එකක් වගේ, පොඩි "state" එකක් (සාරාංශයක්) තියාගෙන tokens එකින් එක කියවනවා. Mamba (Albert Gu සහ Tri Dao, 2023) selective SSM එකක්. ඒ කියන්නේ input එක අනුව මොනවද state එකේ තියාගන්න ඕනේ, මොනවද අමතක කරන්න ඕනේ කියලා තෝරනවා. Sequence length එකට රේඛීයව (n) scale වෙනවා, generate කරද්දී KV cache එකක් නැති නිසා memory ස්ථාවරයි. Jamba වගේ hybrid models Transformer layers සහ Mamba layers එකට භාවිතා කරනවා.',
      ],
      analogy:
        'පන්තියක ළමයි 40 දෙනෙක් ඉන්නවා. සාමාන්‍ය attention = හැම ළමයෙක්ම අනිත් හැම ළමයෙක් එක්කම කතා කරනවා (40 × 40 = සංවාද 1,600). Flash Attention = ඒ සංවාද 1,600ම තියෙනවා, ඒත් ළමයි කණ්ඩායම් වලට බෙදලා එකම කාමරයක් ඇතුළේ කතා කරන නිසා කාමර අතර දුවන කාලය ඉතුරුයි. Mamba = එක ළමයෙක් notebook එකක් අරන් හැමෝගෙන්ම එකින් එක අහගෙන වැදගත් දේවල් විතරක් සාරාංශයක ලියාගන්නවා.',
      example:
        'Tokens 32,000ක context එකක් ගමු. Attention matrix එකේ අගයන් 32,000 × 32,000 = මිලියන 1,024ක්. එක අගයකට bytes 2 බැගින් එක head එකකට විතරක් GB 2ක් විතර. Heads 32ක් නම් GB 64ක්. Flash Attention ඒ matrix එක සම්පූර්ණයෙන් memory එකේ තියාගන්නේ නැති නිසා ඒ GB 64 ඉතුරුයි. Mamba එකට context එක 32,000 වුණත් 64,000 වුණත් generate කරද්දී තියාගන්න state එකේ ප්‍රමාණය එකමයි.',
      keyPoints: [
        'සාමාන්‍ය attention = tokens ගණනේ වර්ගයට (n²) වැඩ සහ memory.',
        'Flash Attention = exact attention, ඒත් GPU memory එක දක්ෂව භාවිතා කරලා ඉක්මන් සහ memory අඩු.',
        'Sparse, sliding window, linear attention, GQA = attention ලාභ කරන වෙනත් ක්‍රම.',
        'Mamba = attention නැති selective state space model එකක්. Sequence length එකට රේඛීයව scale වෙනවා.',
      ],
      terms: [
        { en: 'Flash Attention', si: 'GPU memory hierarchy එකට ගැලපෙන්න tiling කරලා exact attention ඉක්මනට ගණනය කරන algorithm එක.' },
        { en: 'HBM / SRAM', si: 'GPU එකේ ලොකු හෙමින් memory එක / පොඩි ඉතා වේගවත් on-chip memory එක.' },
        { en: 'Quadratic Complexity (n²)', si: 'Input එක දෙගුණ කරාම වැඩේ හතර ගුණයක් වෙන එක.' },
        { en: 'Sparse Attention', si: 'තෝරාගත් token යුගල අතර විතරක් attention ගණනය කරන එක.' },
        { en: 'Sliding Window Attention', si: 'හැම token එකක්ම ළඟම tokens නියමිත ගණනක් විතරක් බලන එක.' },
        { en: 'Grouped-Query Attention (GQA)', si: 'Query heads කීපයක් එකම key/value head එක බෙදාගන්න ක්‍රමය. KV cache එක පොඩි කරනවා.' },
        { en: 'State Space Model (SSM)', si: 'පොඩි සැඟවුණු state එකක් update කරමින් sequence එකක් process කරන model වර්ගය.' },
        { en: 'Mamba', si: 'Input එක අනුව state එක තෝරලා update කරන (selective) SSM architecture එක.' },
      ],
    },
    {
      id: 'interpretability',
      title: 'Mechanistic Interpretability',
      body: [
        'LLM එකක් හොඳට වැඩ කරනවා. ඒත් ඇතුළේ බිලියන ගණනක අංක විතරයි. ඒ අංක වලින් "Colombo ලංකාවේ" කියන දැනුම තියෙන්නේ කොහෙද? Model එක බොරු කියද්දී ඇතුළේ මොකද වෙන්නේ? Mechanistic interpretability කියන්නේ neural network එකක් ඇතුළේ තියෙන "algorithms" reverse engineer කරලා තේරුම් ගන්න උත්සාහ කරන research ක්ෂේත්‍රය.',
        'වැදගත් සොයාගැනීම් කීපයක්. Features: model එක ඇතුළේ "Golden Gate Bridge", "Python code", "බොරුව" වගේ සංකල්ප activations වල දිශාවන් (directions) විදිහට නිරූපණය වෙනවා. Superposition: model එකට neurons වලට වඩා ගොඩක් සංකල්ප තියෙනවා, ඒ නිසා එක neuron එකක් සම්බන්ධ නැති සංකල්ප කීපයකට ප්‍රතිචාර දක්වනවා (polysemantic). Circuits: features එකට සම්බන්ධ වෙලා නිශ්චිත වැඩක් කරන කුඩා උප-networks. උදා: induction heads කියන attention heads, "A B ... A" දැක්කාම ඊළඟට "B" එනවා කියලා අනුමාන කරනවා. මේවා in-context learning වලට වැදගත් කියලා සොයාගත්තා.',
        'Sparse Autoencoders (SAEs) වලින් polysemantic neurons, තේරුම් ගන්න පුළුවන් monosemantic features දහස් ගණනකට, මිලියන ගණනකට වෙන් කරන්න පුළුවන්. Anthropic 2024 දී Claude 3 Sonnet එකේ මිලියන ගණනක features සොයාගත්තා. "Golden Gate Bridge" feature එක කෘත්‍රිමව වැඩි කරාම model එක තමන්වම Golden Gate Bridge කියලා කියන්න පටන් ගත්තා. Probing, activation patching, attribution graphs (circuit tracing) වගේ ක්‍රමත් භාවිතා කරනවා.',
        'මේක වැදගත් ඇයි? Model එකක් ආරක්ෂිතද, බොරු කියනවද, හංගපු අරමුණු තියෙනවද කියලා outputs විතරක් බලලා සහතික කරන්න අමාරුයි. ඇතුළ බලන්න පුළුවන් නම් ආරක්ෂාව ගැන වඩා විශ්වාසයෙන් කියන්න පුළුවන්. මේ ක්ෂේත්‍රය තාම ළදරුයි. ලොකු models වල ගොඩක් දේවල් තාම තේරුම් අරන් නෑ.',
      ],
      analogy:
        'Doctor කෙනෙක් ලෙඩෙක්ගෙන් ප්‍රශ්න අහලා විතරක් රෝගය හොයන එක behavioral testing වගේ. MRI scan එකක් අරන් මොළයේ කොයි කොටසද වැඩ කරන්නේ කියලා බලන එක mechanistic interpretability වගේ. Scan එකෙන් රෝගය හොයන්න පුළුවන්, ලෙඩා හංගන දේවලුත් පේනවා.',
      example:
        'Researchers model එකකට "The capital of France is" කියලා දුන්නාම "Paris" කියනවා. Activation patching වලදී, "France" ගැන prompt එකක activations, "Germany" ගැන prompt එකක එකම layer එකට එකින් එක මාරු කරලා බලනවා. Layer 15ක එක specific තැනක් මාරු කරාම විතරක් output එක "Berlin" ඉඳන් "Paris" ට මාරු වෙනවා නම්, රට පිළිබඳ තොරතුර ගෙනියන්නේ ඒ තැනින් කියලා දැනගන්න පුළුවන්.',
      keyPoints: [
        'Mechanistic interpretability = neural network ඇතුළේ algorithms reverse engineer කරන එක.',
        'Features = සංකල්ප activation space එකේ දිශාවන් විදිහට.',
        'Superposition නිසා neurons polysemantic. SAEs වලින් ඒවා වෙන් කරන්න පුළුවන්.',
        'Circuits (උදා: induction heads) = නිශ්චිත වැඩ කරන කුඩා උප-networks.',
        'AI safety වලට ඉතා වැදගත්, ඒත් තාම අලුත් ක්ෂේත්‍රයක්.',
      ],
      terms: [
        { en: 'Mechanistic Interpretability', si: 'Model එකක ඇතුළත ගණනය කිරීම් මිනිසුන්ට තේරෙන algorithms විදිහට පැහැදිලි කරන research එක.' },
        { en: 'Feature', si: 'Model එක ඇතුළේ සංකල්පයක් නිරූපණය කරන activations වල දිශාවක්.' },
        { en: 'Superposition', si: 'Neurons වලට වඩා වැඩි features ගණනක් එකම space එකේ අතිච්ඡාදනය වෙලා තියෙන එක.' },
        { en: 'Polysemantic Neuron', si: 'සම්බන්ධ නැති සංකල්ප කීපයකටම activate වෙන neuron එකක්.' },
        { en: 'Circuit', si: 'Features සහ weights එකට සම්බන්ධ වෙලා නිශ්චිත හැසිරීමක් ඇති කරන කොටස.' },
        { en: 'Induction Head', si: 'කලින් දැකපු රටාවක් පිටපත් කරලා ඊළඟ token එක අනුමාන කරන attention head circuit එකක්.' },
        { en: 'Sparse Autoencoder (SAE)', si: 'Activations, තේරුම් ගන්න පුළුවන් sparse features වලට වෙන් කරන network එකක්.' },
        { en: 'Activation Patching', si: 'එක run එකක activations තව run එකකට මාරු කරලා වැදගත් කොටස් හොයන ක්‍රමය.' },
        { en: 'Probing', si: 'Activations වල නිශ්චිත තොරතුරක් තියෙනවද කියලා පොඩි classifier එකකින් පරීක්ෂා කරන එක.' },
      ],
    },
    {
      id: 'safety-ethics',
      title: 'AI Safety & Ethics (Bias, Fairness, Privacy, Alignment, EU AI Act)',
      body: [
        'Bias: model එක ඉගෙන ගන්නේ data වලින්. Data වල සමාජයේ අසාධාරණකම් තියෙනවා නම් model එකත් ඒවා ඉගෙන ගන්නවා, සමහර වෙලාවට වැඩි කරනවා. Amazon එකේ පරණ CV screening tool එකක් අතීත hiring data වලින් ඉගෙන ගෙන කාන්තාවන්ට අවාසි කළා කියලා 2018 දී වාර්තා වුණා. ඒ නිසා ඒ tool එක අත්හැරියා. Face recognition models සමහර සම පැහැයන් වලට වැඩි වැරදි කරන බව පර්යේෂණ වලින් පෙන්නුවා.',
        'Fairness: කණ්ඩායම් අතර සාධාරණද කියලා මනින්න ක්‍රම කීපයක් තියෙනවා. Demographic parity = හැම කණ්ඩායමකටම එකම අනුපාතයකින් positive තීරණ. Equalized odds = හැම කණ්ඩායමකටම එකම true positive සහ false positive rates. වැදගත් සත්‍යයක්: සාමාන්‍ය තත්ත්වයන් යටතේ මේ fairness definitions හැම එකක්ම එකවර තෘප්ත කරන්න ගණිතමය වශයෙන් බෑ. ඒ නිසා මොන එකද වැදගත් කියලා තීරණය කරන්න ඕනේ මිනිස්සු.',
        'Privacy: models වලට training data කටපාඩම් කරලා ආපහු කියන්න පුළුවන් (memorization). විසඳුම්: PII අයින් කරන එක, differential privacy (training වලට ගණනය කරපු noise එකතු කරලා එක පුද්ගලයෙක්ගේ data වල බලපෑම සීමා කරන එක), federated learning (data phone එකෙන් එළියට නොගෙන model එක phone එකේම train කරලා updates විතරක් යවන එක). ලංකාවේ Personal Data Protection Act (PDPA, අංක 9, 2022) සහ යුරෝපයේ GDPR වගේ නීතිත් තියෙනවා.',
        'Alignment: AI එක අපිට ඇත්තටම ඕනේ දේ කරනවද, අපි කිව්ව වචන විතරක් අකුරටම කරනවද? Reward hacking (reward එක වැඩි කරගන්න බලාපොරොත්තු නොවුණු කෙටි මං හොයන එක) වගේ ප්‍රශ්න තියෙනවා. RLHF, Constitutional AI, red teaming, interpretability වගේ ක්‍රම alignment වලට භාවිතා කරනවා. Responsible AI කියන්නේ මේ ඔක්කොම (fairness, transparency, privacy, accountability, safety) ප්‍රායෝගිකව ආයතනයක ක්‍රියාත්මක කරන එක. EU AI Act (2024 අගෝස්තුවේ බලාත්මක වුණා, නීති අවුරුදු කීපයක් ඇතුළත පියවරෙන් පියවර ක්‍රියාත්මක වෙනවා) කියන්නේ ලෝකයේ පළමු විශාල AI නීතිය. ඒක AI systems අවදානම අනුව වර්ග කරනවා: unacceptable risk (තහනම්, උදා: social scoring), high risk (දැඩි නීති, උදා: රැකියා තෝරාගැනීම, ණය, අධ්‍යාපනය), limited risk (transparency, උදා: chatbot එකක් කියලා දැනුම් දෙන්න ඕනේ), minimal risk (නීති අඩුයි, උදා: spam filters).',
      ],
      analogy:
        'Cricket umpire කෙනෙක් හිතන්න. එක කණ්ඩායමකට විතරක් LBW දෙනවා නම් ඒක bias. Umpire ලගේ තීරණ සාධාරණද කියලා බලන්න statistics (fairness metrics). DRS (video review) කියන්නේ තීරණ පරීක්ෂා කරන්න පුළුවන් transparency එක. ICC නීති කියන්නේ EU AI Act වගේ නීති රාමුව. Alignment කියන්නේ umpire ට "ලකුණු ගොඩක් එන්න උදව් කරන්න" කියලා කිව්වාම නීති කඩලා සියල්ල four දෙන එක නෙවෙයි, ඇත්තටම හොඳ තරගයක් තියෙන්න වැඩ කරන එක.',
      example:
        'Bank එකක loan approval model එකක් පරීක්ෂා කරනවා. Colombo applicants ලගෙන් 60%කට approve වෙනවා, ගම්බද applicants ලගෙන් 30%කට විතරයි. ඒත් ඇත්තටම ණය ආපසු ගෙවන අනුපාතය කණ්ඩායම් දෙකේම 90% වගේ. ඒ කියන්නේ model එක ලිපිනය හරහා bias එකක් ඉගෙන ගෙන. EU AI Act යටතේ credit scoring high-risk කාණ්ඩයේ. ඒ නිසා යුරෝපයේ මේ වගේ system එකකට bias පරීක්ෂා කිරීම, documentation, මිනිස් අධීක්ෂණය අනිවාර්යයි.',
      keyPoints: [
        'Bias data වලින් එනවා. Model එක ඒක පිටපත් කරනවා, සමහර වෙලාවට වැඩි කරනවා.',
        'Fairness definitions කීපයක් තියෙනවා, හැම එකක්ම එකවර තෘප්ත කරන්න සාමාන්‍යයෙන් බෑ.',
        'Privacy: PII අයින් කිරීම, differential privacy, federated learning, PDPA / GDPR නීති.',
        'Alignment = AI එක අපේ ඇත්ත අරමුණු අනුව හැසිරෙන එක.',
        'EU AI Act = අවදානම අනුව (unacceptable, high, limited, minimal) AI systems නියාමනය කරන නීතිය.',
      ],
      terms: [
        { en: 'Bias', si: 'Data හෝ model එක නිසා කණ්ඩායම් වලට ක්‍රමානුකූලව අසාධාරණ ප්‍රතිඵල ලැබීම.' },
        { en: 'Fairness', si: 'Model එකේ තීරණ කණ්ඩායම් අතර සාධාරණද කියන එක, metrics වලින් මනිනවා.' },
        { en: 'Demographic Parity', si: 'හැම කණ්ඩායමකටම එකම අනුපාතයකින් positive ප්‍රතිඵල ලැබීම.' },
        { en: 'Equalized Odds', si: 'හැම කණ්ඩායමකටම එකම true positive සහ false positive rates තිබීම.' },
        { en: 'Privacy', si: 'පුද්ගලයන්ගේ data ආරක්ෂා කිරීම සහ අනවසර භාවිතයෙන් වැළැක්වීම.' },
        { en: 'Differential Privacy', si: 'එක පුද්ගලයෙක්ගේ data ප්‍රතිඵලයට කරන බලපෑම ගණිතමය වශයෙන් සීමා කරන ක්‍රමය.' },
        { en: 'Federated Learning', si: 'Data එක තැනකට එකතු නොකර, devices වලම train කරලා updates විතරක් එකතු කරන ක්‍රමය.' },
        { en: 'Alignment', si: 'AI system එකක හැසිරීම මිනිස් අරමුණු සහ වටිනාකම් එක්ක ගැලපීම.' },
        { en: 'Reward Hacking', si: 'Reward එක වැඩි කරගන්න බලාපොරොත්තු නොවුණු, අනවශ්‍ය කෙටි මං හොයාගැනීම.' },
        { en: 'Red Teaming', si: 'System එකේ දුර්වලකම් හොයන්න හිතාමතාම ප්‍රහාර කරන පරීක්ෂණය.' },
        { en: 'Responsible AI', si: 'Fairness, transparency, privacy, accountability, safety ප්‍රායෝගිකව ක්‍රියාත්මක කරන මූලධර්ම සහ ක්‍රියාවලි.' },
        { en: 'EU AI Act', si: 'අවදානම මත පදනම් වූ යුරෝපා සංගමයේ AI නීතිය. 2024 බලාත්මක වී පියවරෙන් පියවර ක්‍රියාත්මක වෙනවා.' },
        { en: 'GDPR / PDPA', si: 'යුරෝපයේ / ශ්‍රී ලංකාවේ personal data ආරක්ෂණ නීති.' },
      ],
    },
    {
      id: 'reading-papers',
      title: 'Reading Research Papers (arXiv, Papers with Code)',
      body: [
        'AI ලෝකය ඉතා වේගයෙන් වෙනස් වෙනවා. අලුත්ම අදහස් මුලින්ම එන්නේ research papers විදිහට. "Attention Is All You Need" (2017, Transformer), "Language Models are Few-Shot Learners" (2020, GPT-3) වගේ papers ක්ෂේත්‍රයම වෙනස් කළා. Hero කෙනෙක් වෙන්න papers කියවන්න පුරුදු වෙන්න ඕනේ.',
        'arXiv (arxiv.org) කියන්නේ researchers ලා papers නොමිලේ upload කරන තැන. ගොඩක් AI papers conference එකක පළ වෙන්න කලින් මුලින්ම මෙතන එනවා. මතක තියාගන්න: arXiv papers සාමාන්‍යයෙන් peer review කරලා නෑ. ඒ නිසා ඒවායේ කියන හැම දෙයක්ම සත්‍ය කියලා හිතන්න එපා. NeurIPS, ICML, ICLR, ACL, CVPR වගේ conferences වල peer review කරපු papers පළ වෙනවා.',
        'Papers with Code කියන්නේ papers සහ ඒවායේ code repos, benchmark results එකට සම්බන්ධ කරපු website එකක්. 2025 මැද දී Meta ඒක නතර කරලා, දැන් ඒ link Hugging Face Papers (huggingface.co/papers) පිටුවට යොමු වෙනවා. Hugging Face Papers එකේ දවසේ trending papers, ඒවායේ code සහ models හොයාගන්න පුළුවන්. Semantic Scholar, Google Scholar, alphaXiv වගේ tools වලිනුත් papers හොයාගන්න, citations බලන්න පුළුවන්.',
        'Practical method එකක් (S. Keshav ගෙ "three-pass" ක්‍රමය): පළමු වටය (විනාඩි 5-10): title, abstract, introduction, section headings, conclusion සහ figures විතරක් බලනවා. ප්‍රශ්නය මොකක්ද, ඒ ගොල්ලෝ කියන අලුත් දේ මොකක්ද, මට මේක වැදගත්ද කියලා තීරණය කරනවා. දෙවන වටය (පැයක් විතර): figures, tables, results හොඳින් කියවනවා, තේරෙන්නේ නැති references ලියාගන්නවා, ගණිතයේ විස්තර මගහරිනවා. තුන්වන වටය (පැය කීපයක්): ඔයාම ඒ paper එක ආයෙත් හදනවා වගේ හිතලා, හැම උපකල්පනයක්ම ප්‍රශ්න කරනවා, තියෙනවා නම් code එක run කරනවා. ගොඩක් papers වලට පළමු වටය ඇති. ඔයාගේ වැඩට ඉතා වැදගත් ඒවාට විතරක් තුන්වන වටයට යන්න.',
      ],
      analogy:
        'පත්තරයක් කියවනවා වගේ. මුලින් headlines ඔක්කොම බලනවා (පළමු වටය). උනන්දු වෙන ප්‍රවෘත්ති කීපයක් සම්පූර්ණයෙන් කියවනවා (දෙවන වටය). ඔයාගේ business එකට කෙලින්ම බලපාන එකක් නම්, වෙනත් පත්තර එක්කත් සංසන්දනය කරලා, දත්ත check කරලා, ගැඹුරින් අධ්‍යයනය කරනවා (තුන්වන වටය). හැම ප්‍රවෘත්තියක්ම තුන්වන වටයට යන්නේ නෑ.',
      example:
        'ඔයාට LoRA ගැන දැනගන්න ඕනේ. arXiv එකේ "LoRA: Low-Rank Adaptation of Large Language Models" (2021) හොයාගන්නවා. පළමු වටය (විනාඩි 10): abstract එකෙන් දැනගන්නවා "GPT-3 175B fine-tune කරද්දී trainable parameters 10,000 ගුණයකින් අඩු කරනවා" කියලා. ඔයාට වැදගත් නිසා දෙවන වටය (පැයක්): Figure 1 එක බලලා A සහ B කියන පොඩි matrices දෙකක් එකතු කරන අදහස තේරුම් ගන්නවා, results tables බලනවා. තුන්වන වටය: Hugging Face PEFT library එකෙන් පොඩි model එකක් LoRA වලින් fine-tune කරලා paper එකේ කියන දේ තමන්ම බලනවා.',
      keyPoints: [
        'arXiv = නොමිලේ papers (සාමාන්‍යයෙන් peer review නැති preprints).',
        'Papers with Code දැන් Hugging Face Papers වලට යොමු වෙනවා. Papers සමඟ code, models හොයන්න එතන.',
        'Three-pass method: skim → වැදගත් කොටස් කියවන්න → ගැඹුරින් / code එකෙන් ආයෙත් හදන්න.',
        'හැම paper එකක්ම සම්පූර්ණයෙන් කියවන්න ඕනේ නෑ. Abstract සහ figures වලින් පටන් ගන්න.',
      ],
      terms: [
        { en: 'arXiv', si: 'Physics, maths, CS papers නොමිලේ පළ කරන preprint server එක.' },
        { en: 'Papers with Code', si: 'Papers, code සහ benchmark results සම්බන්ධ කරපු website එක. 2025 සිට Hugging Face Papers වලට යොමු වෙනවා.' },
        { en: 'Hugging Face Papers', si: 'Trending AI papers, ඒවායේ models, datasets, code එකට පෙන්නන පිටුව.' },
        { en: 'Preprint', si: 'Peer review වෙන්න කලින් පළ කරපු paper එකක්.' },
        { en: 'Peer Review', si: 'එම ක්ෂේත්‍රයේ වෙනත් විශේෂඥයින් paper එකක් පළ කරන්න කලින් පරීක්ෂා කිරීම.' },
        { en: 'Abstract', si: 'Paper එකේ මුලින්ම තියෙන කෙටි සාරාංශය.' },
        { en: 'Ablation Study', si: 'Method එකේ කොටස් එකින් එක අයින් කරලා හැම කොටසකම වැදගත්කම මනින පරීක්ෂණය.' },
        { en: 'Benchmark', si: 'Models සංසන්දනය කරන්න භාවිතා කරන සම්මත test set එකක්.' },
        { en: 'Three-Pass Method', si: 'Paper එකක් වටයන් තුනකින්, ගැඹුර ටික ටික වැඩි කරමින් කියවන ක්‍රමය.' },
      ],
    },
    {
      id: 'causal-inference',
      title: 'Causal Inference',
      body: [
        'ML models දක්ෂයි රටා (correlations) අල්ලගන්න. ඒත් "A නිසාද B වුණේ?" කියන ප්‍රශ්නයට correlation වලින් උත්තර දෙන්න බෑ. Correlation is not causation. Causal inference කියන්නේ හේතුව සහ ප්‍රතිඵලය අතර සම්බන්ධය data වලින් හොයාගන්න විද්‍යාව.',
        'ප්‍රධාන ප්‍රශ්නය confounders. Confounder එකක් කියන්නේ විචල්‍ය දෙකකටම බලපාන තුන්වන හේතුවක්. උදා: ice cream විකුණුම් වැඩි වෙන දවස් වල මුහුදේ ගිලෙන අයත් වැඩියි. Ice cream නිසා ගිලෙනවද? නෑ. දෙකටම හේතුව අව්ව වැඩි, රස්නේ දවස් (confounder). එදාට ice cream කනවත් වැඩියි, මුහුදේ නාන්න යනවත් වැඩියි.',
        'හොඳම ක්‍රමය Randomized Controlled Trial (RCT), web වල A/B test. අහඹු විදිහට කණ්ඩායම් දෙකකට බෙදලා, එකකට විතරක් treatment එක දෙනවා. අහඹු නිසා confounders කණ්ඩායම් දෙකේම සමානව බෙදෙනවා. RCT කරන්න බැරි වෙලාවට (සදාචාරාත්මක නැති, මිල වැඩි) observational data වලින් ක්‍රම භාවිතා කරනවා: causal graphs (DAGs, Judea Pearl), propensity score matching, difference-in-differences, instrumental variables, regression discontinuity.',
        'ML එක්ක සම්බන්ධය: uplift modeling (discount එකක් දුන්නොත් මේ customer මිලදී ගැනීම කොච්චර වැඩි වෙනවද), DoWhy, EconML, CausalML වගේ Python libraries. "Discount එක නිසාද customers ආපහු ආවේ?" වගේ business ප්‍රශ්න වලට මේක අත්‍යවශ්‍යයි.',
      ],
      analogy:
        'ඉස්කෝලේ tuition යන ළමයි A/L වල හොඳ results ගන්නවා කියලා data පෙන්නනවා. ඒත් tuition නිසාමද? Tuition යන ළමයින්ගේ දෙමව්පියන්ට සාමාන්‍යයෙන් සල්ලි වැඩියි, ගෙදර පොත් වැඩියි, ඉගෙන ගන්න කාලය වැඩියි. ඒ "පවුලේ ආර්ථික තත්ත්වය" කියන confounder එක tuition යන එකටත් results වලටත් දෙකටම බලපානවා. Tuition එකේම බලපෑම දැනගන්න නම් ඒ වගේ අනිත් දේවල් සමාන ළමයි සංසන්දනය කරන්න ඕනේ.',
      example:
        'E-commerce app එකක් premium membership ගත්ත customers මාසෙකට රු. 15,000ක් වියදම් කරනවා, අනිත් අය රු. 5,000ක්. "Membership එක නිසා වියදම තුන් ගුණයක් වෙනවා" කියලා කියන්න පුළුවන්ද? නෑ. කලින්ම වැඩිපුර වියදම් කරපු අය තමයි membership ගත්තේ. ඒ නිසා A/B test එකක් කරනවා: අහඹු users 10,000කට නොමිලේ membership එක දෙනවා, තව 10,000කට නෑ. ප්‍රතිඵලය: membership කණ්ඩායම රු. 6,200, අනිත් කණ්ඩායම රු. 5,000. ඇත්ත causal effect එක රු. 1,200ක් විතරයි, රු. 10,000ක් නෙවෙයි.',
      keyPoints: [
        'Correlation ≠ causation. රටාවක් තිබුණාට හේතුව ඒක නෙවෙයි වෙන්න පුළුවන්.',
        'Confounder = විචල්‍ය දෙකටම බලපාන සැඟවුණු තුන්වන හේතුව.',
        'RCT / A/B test = causal effect එක මනින හොඳම ක්‍රමය.',
        'Observational data වලට DAGs, propensity scores, difference-in-differences වගේ ක්‍රම.',
      ],
      terms: [
        { en: 'Causal Inference', si: 'Data වලින් හේතු-ඵල සම්බන්ධතා හොයාගන්න ක්‍රම.' },
        { en: 'Correlation vs Causation', si: 'දේවල් දෙකක් එකට වෙනස් වෙන එකයි, එකක් අනිත් එකට හේතු වෙන එකයි අතර වෙනස.' },
        { en: 'Confounder', si: 'Treatment එකටත් ප්‍රතිඵලයටත් දෙකටම බලපාන තුන්වන විචල්‍යය.' },
        { en: 'RCT', si: 'Randomized Controlled Trial. අහඹු ලෙස කණ්ඩායම් වලට බෙදා කරන පරීක්ෂණය.' },
        { en: 'Causal Graph (DAG)', si: 'විචල්‍ය අතර හේතු-ඵල සම්බන්ධතා ඊතල වලින් පෙන්නන සිතියම.' },
        { en: 'Propensity Score Matching', si: 'Treatment එක ලැබීමේ සම්භාවිතාව සමාන අය සංසන්දනය කරන ක්‍රමය.' },
        { en: 'Difference-in-Differences', si: 'කණ්ඩායම් දෙකක කලින් සහ පස්සේ වෙනස්කම් සංසන්දනය කරන ක්‍රමය.' },
        { en: 'Uplift Modeling', si: 'Treatment එකක් එක් එක් පුද්ගලයාට කරන අමතර බලපෑම අනුමාන කරන ML ක්‍රමය.' },
        { en: 'Counterfactual', si: '"එහෙම නොකළා නම් මොකද වෙන්නේ" කියන කල්පිත ප්‍රතිඵලය.' },
      ],
    },
    {
      id: 'bayesian-ml',
      title: 'Bayesian ML',
      body: [
        'සාමාන්‍ය ML model එකක් එක උත්තරයක් දෙනවා: "මේ ගෙදර මිල ලක්ෂ 150යි". Bayesian ML කියනවා "ලක්ෂ 150ක් වෙන්න ඉඩ වැඩියි, ඒත් 130-170 අතර ඕනෑම අගයක් වෙන්න පුළුවන්" කියලා. ඒ කියන්නේ model එක කොච්චර සහතිකද (uncertainty) කියලාත් කියනවා. Medicine, finance, self-driving cars වගේ තැන්වල "මම දන්නේ නෑ" කියලා කියන්න පුළුවන් model එකක් ඉතා වැදගත්.',
        'Bayesian හිතන විදිහ: Prior (data බලන්න කලින් අපේ විශ්වාසය) + Likelihood (data එක කොච්චර ගැලපෙනවද) → Posterior (data බලලා update කරපු විශ්වාසය). අලුත් data එන එන විදිහට posterior එක ඊළඟ prior එක වෙනවා. මේකට පදනම Bayes\' theorem: posterior එක prior එක සහ likelihood එකේ ගුණිතයට සමානුපාතිකයි.',
        'Bayesian ML ක්‍රම: Naive Bayes (සරල classifier, spam filters), Bayesian linear regression, Gaussian Processes (පොඩි data වලට uncertainty එක්කම smooth curves fit කරනවා, hyperparameter tuning වල Bayesian optimization එකට භාවිතා වෙනවා), Bayesian Neural Networks (weights වලට තනි අගයන් වෙනුවට distributions). Posterior එක හරියටම ගණනය කරන්න සාමාන්‍යයෙන් බැරි නිසා MCMC (sampling ක්‍රම) සහ variational inference (approximate ක්‍රම) භාවිතා කරනවා. Python වලට PyMC, NumPyro, Stan වගේ libraries තියෙනවා.',
        'අවාසි: ගණනය කිරීම් ගොඩක් වැඩියි, ලොකු models වලට scale කරන්න අමාරුයි. ප්‍රායෝගිකව සරල විකල්ප: MC Dropout (prediction වලදී dropout on කරලා කීප පාරක් run කරන එක) සහ ensembles (models කීපයක් train කරලා ඒවා කොච්චර එකඟද බලන එක).',
      ],
      analogy:
        'අලුත් කඩයක kottu එකක් හොඳද කියලා හිතනවා. Prior: "Colombo kottu කඩ ගොඩක් හොඳයි" කියලා කලින් විශ්වාසයක් තියෙනවා. දැන් ඔයා එතන කාලා බලනවා, ලුණු වැඩියි (data). ඔයාගේ විශ්වාසය ටිකක් අඩු වෙනවා (posterior). යාළුවෝ තුන් දෙනෙක් කියනවා නියමයි කියලා. විශ්වාසය ආයෙත් වැඩි වෙනවා. අලුත් තොරතුරු එන එන විදිහට විශ්වාසය update කරන එක තමයි Bayesian හිතීම.',
      example:
        'Cricket ක්‍රීඩකයෙක් ගැන හිතමු. Prior: test batsman කෙනෙක්ගේ සාමාන්‍ය average එක 35ක් විතර කියලා අපි දන්නවා. අලුත් ක්‍රීඩකයෙක් පළමු innings 2කින් 100 සහ 80 ගහනවා. Data විතරක් බැලුවොත් average 90යි. ඒත් innings 2ක් ගොඩක් අඩුයි. Bayesian estimate එක prior 35 සහ data 90 අතර තැනකට (උදා: 50 වගේ) එනවා. Innings 50ක් ගැහුවාට පස්සේ data එක ප්‍රබල නිසා prior එකේ බලපෑම අඩු වෙලා estimate එක ඇත්ත average එකට ළඟා වෙනවා.',
      keyPoints: [
        'Bayesian ML = උත්තරයක් විතරක් නෙවෙයි, uncertainty එකත් දෙනවා.',
        'Prior + likelihood → posterior. අලුත් data එක්ක විශ්වාසය update කරනවා.',
        'Data අඩු වෙලාවට prior එක ගොඩක් බලපානවා. Data වැඩි වෙද්දී data එක ප්‍රබල වෙනවා.',
        'ක්‍රම: Naive Bayes, Gaussian Processes, Bayesian NNs, MCMC, variational inference.',
      ],
      terms: [
        { en: 'Bayesian ML', si: 'Parameters සහ predictions සම්භාවිතා distributions විදිහට සලකන ML ප්‍රවේශය.' },
        { en: 'Prior', si: 'Data බලන්න කලින් තිබුණු විශ්වාසය.' },
        { en: 'Likelihood', si: 'යම් උපකල්පනයක් යටතේ අපි දැක්ක data එක ලැබෙන්න තියෙන සම්භාවිතාව.' },
        { en: 'Posterior', si: 'Data බලලා update කරපු විශ්වාසය.' },
        { en: 'Uncertainty', si: 'Model එක තමන්ගේ prediction එක ගැන කොච්චර සහතික නැද්ද කියන එක.' },
        { en: 'Gaussian Process', si: 'Functions මත distribution එකක් තියාගෙන uncertainty එක්ක predict කරන ක්‍රමය.' },
        { en: 'Bayesian Optimization', si: 'Gaussian Process වගේ model එකක් භාවිතා කරලා අඩු උත්සාහයකින් හොඳම settings හොයන ක්‍රමය.' },
        { en: 'MCMC', si: 'Markov Chain Monte Carlo. Posterior එකෙන් samples ගන්න ක්‍රම.' },
        { en: 'Variational Inference', si: 'Posterior එක සරල distribution එකකින් approximate කරන ක්‍රමය.' },
      ],
    },
    {
      id: 'become-hero',
      title: 'How to Become a Hero',
      body: [
        'Theory කියවලා විතරක් hero වෙන්න බෑ. ඇත්ත ඉගෙනීම වෙන්නේ projects කරද්දී, errors එද්දී, ඒවා හදද්දී. මේ project ladder එකේ හැම පඩියක්ම කලින් එකට වඩා ටිකක් අමාරුයි, හැම එකකින්ම අලුත් කුසලතා ටිකක් එකතු වෙනවා.',
        'Project ladder: (1) House price prediction: regression, pandas, scikit-learn, train/test split. (2) Customer churn prediction: classification, imbalanced data, precision / recall. (3) Image classifier (උදා: cats vs dogs, හෝ ලංකාවේ කුරුල්ලෝ): CNNs, PyTorch, transfer learning. (4) Sentiment analyzer (Sinhala හෝ English reviews): NLP, tokenization, Hugging Face Transformers. (5) LoRA fine-tune: පොඩි open model එකක් ඔයාගේම data වලින් PEFT / LoRA වලින් fine-tune කරන එක. (6) RAG chatbot over your own PDFs: chunking, embeddings, vector database, LLM API. (7) Agent with tools: calculator, web search, database tools භාවිතා කරන agent කෙනෙක්. (8) Deploy with FastAPI + Docker: ඔයාගේ හොඳම project එක API එකක් කරලා container එකක දාලා cloud එකේ live කරන එක.',
        'හැම project එකක්ම GitHub එකේ දාන්න, හොඳ README එකක් එක්ක (ප්‍රශ්නය, data, ක්‍රමය, ප්‍රතිඵල, run කරන හැටි). Blog post එකක් හෝ LinkedIn post එකක් ලියන්න. ඒක ඔයාගේ portfolio එක. Interview එකකදී certificates වලට වඩා බලන්නේ මේවා.',
        'නොමිලේ හොඳම resources: StatQuest (Josh Starmer, statistics සහ ML ලේසියෙන්, "BAM!"), 3Blue1Brown (Grant Sanderson, neural networks, linear algebra, Transformers ලස්සන animations වලින්), Andrew Ng ගෙ courses (Coursera / DeepLearning.AI: Machine Learning Specialization, Deep Learning Specialization, නොමිලේ short courses. Coursera audit option එකෙන් බොහෝ courses නොමිලේ බලන්න පුළුවන්), fast.ai (Jeremy Howard, "Practical Deep Learning for Coders", code එකෙන් පටන් ගන්න top-down ක්‍රමය), Andrej Karpathy ගෙ Neural Networks: Zero to Hero (micrograd ඉඳන් GPT දක්වා code ලියමින්), Hugging Face course (Transformers, LLMs, agents, නොමිලේ), Kaggle (නොමිලේ datasets, notebooks, GPUs, competitions, Kaggle Learn short courses).',
      ],
      analogy:
        'Cricket player කෙනෙක් වෙන්න cricket පොත් කියවලා විතරක් බෑ. Nets වල දවස් ගණන් practice කරන්න ඕනේ. මුලින් ඉස්කෝලේ under-13, ඊට පස්සේ under-19, club, ඊට පස්සේ national team. Project ladder එකත් එහෙමයි. House price prediction කියන්නේ under-13 match එක. FastAPI + Docker වලින් live deploy කරපු agent කෙනෙක් කියන්නේ national team cap එක.',
      example:
        'සතියකට පැය 10ක් වැය කරනවා කියමු. Projects 1-2: සති 2 බැගින්. Project 3-4: සති 3 බැගින්. Project 5: සති 3. Project 6: සති 3. Project 7: සති 3. Project 8: සති 2. මුළු එකතුව සති 21ක් විතර, ඒ කියන්නේ මාස 5ක් විතර. ඒ කාලය ඇතුළත ඔයාට GitHub එකේ projects 8ක් තියෙනවා, ඉන් එකක් live URL එකක. Junior ML / AI engineer interview එකකට යන්න ඒක හොඳ පදනමක්.',
      keyPoints: [
        'Projects වලින් ඉගෙන ගන්න. කියවන කාලයට වඩා code ලියන කාලය වැඩි කරන්න.',
        'Ladder: house price → churn → image classifier → sentiment → LoRA fine-tune → RAG chatbot → agent → FastAPI + Docker deploy.',
        'හැම project එකක්ම GitHub එකේ, හොඳ README එකක් එක්ක.',
        'නොමිලේ: StatQuest, 3Blue1Brown, Andrew Ng, fast.ai, Karpathy Zero to Hero, Hugging Face course, Kaggle.',
        'දිනපතා ටිකක් වුණත් නොනවත්වා කරන එක තමයි රහස.',
      ],
      terms: [
        { en: 'Portfolio', si: 'ඔයාගේ කුසලතා පෙන්නන projects එකතුව (GitHub, blog, live demos).' },
        { en: 'StatQuest', si: 'Josh Starmer ගෙ, statistics සහ ML සරලව පැහැදිලි කරන YouTube channel එක.' },
        { en: '3Blue1Brown', si: 'Grant Sanderson ගෙ, ගණිතය සහ neural networks animations වලින් පෙන්නන YouTube channel එක.' },
        { en: 'Andrew Ng Courses', si: 'Coursera / DeepLearning.AI එකේ ML සහ deep learning ගැන ප්‍රසිද්ධ courses.' },
        { en: 'fast.ai', si: 'Jeremy Howard ගෙ, ප්‍රායෝගිකව code එකෙන් පටන් ගන්න නොමිලේ deep learning course එක.' },
        { en: 'Karpathy Neural Networks: Zero to Hero', si: 'Backpropagation ඉඳන් GPT දක්වා මුල ඉඳන්ම code ලියමින් උගන්වන නොමිලේ YouTube series එක.' },
        { en: 'Hugging Face Course', si: 'Transformers, LLMs, agents ගැන Hugging Face එකේ නොමිලේ online course එක.' },
        { en: 'Kaggle', si: 'නොමිලේ datasets, notebooks, GPU, competitions සහ short courses තියෙන data science platform එක.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Reinforcement learning, supervised learning වලින් ප්‍රධාන වශයෙන් වෙනස් වෙන්නේ කොහොමද?',
      options: [
        'RL වල හැම input එකකටම හරි label එක තියෙනවා',
        'RL වල agent ක්‍රියා කරලා ලැබෙන rewards වලින් trial and error කරලා ඉගෙන ගන්නවා',
        'RL වලට data කිසිසේත්ම ඕනේ නෑ',
      ],
      answer: 1,
      why: 'RL වල හරි උත්තරය කියලා දෙන්නේ නෑ. Agent environment එකේ actions කරලා ලැබෙන rewards වලින් දිගුකාලීනව reward එක වැඩි කරන්නේ කොහොමද කියලා ඉගෙන ගන්නවා.',
    },
    {
      q: 'Q(s, a) = 2, reward = 10, ඊළඟ state එකේ හොඳම Q = 5, α = 0.1, γ = 0.9 නම් Q-learning update එකෙන් පස්සේ අලුත් Q අගය කීයද?',
      options: ['3.25', '14.5', '2.5'],
      answer: 0,
      why: 'Target = 10 + 0.9 × 5 = 14.5. වෙනස = 14.5 − 2 = 12.5. අලුත් Q = 2 + 0.1 × 12.5 = 3.25. Target එකට කෙලින්ම පනින්නේ නැතුව ඒ දිහාවට පොඩි පියවරක් තියනවා.',
    },
    {
      q: 'PPO algorithm එකේ ප්‍රධාන අදහස මොකක්ද?',
      options: [
        'Q table එකක් භාවිතා කරන එක',
        'එක update එකකදී policy එක ගොඩක් වෙනස් වෙන්න නොදී (clipping) training එක ස්ථාවර කරන එක',
        'Rewards කිසිසේත්ම භාවිතා නොකරන එක',
      ],
      answer: 1,
      why: 'PPO එක update එකකදී පරණ සහ අලුත් policy අතර වෙනස සීමා කරනවා. ඒ නිසා training එක කඩාවැටෙන්නේ නැතුව ස්ථාවරව ඉදිරියට යනවා.',
    },
    {
      q: 'Flash Attention ගැන නිවැරදි ප්‍රකාශය මොකක්ද?',
      options: [
        'ඒක attention approximate කරනවා, ඒ නිසා ප්‍රතිඵල ටිකක් වෙනස්',
        'ඒක exact attention ම ගණනය කරනවා, ඒත් GPU memory එක දක්ෂව භාවිතා කරලා ඉක්මන් සහ memory අඩු කරනවා',
        'ඒක attention සම්පූර්ණයෙන්ම අයින් කරලා RNN එකක් භාවිතා කරනවා',
      ],
      answer: 1,
      why: 'Flash Attention ප්‍රතිඵලය වෙනස් කරන්නේ නෑ. Tiling කරලා වේගවත් SRAM එකේ ගණනය කරන නිසා HBM reads/writes අඩු වෙනවා. Attention නැතුව sequences process කරන්නේ Mamba වගේ SSMs.',
    },
    {
      q: 'GPUs 8ක වැඩ කරද්දී, හැම GPU එකකම සම්පූර්ණ model copy එකක් නොතියා weights, gradients, optimizer states shard කරන PyTorch ක්‍රමය මොකක්ද?',
      options: ['DDP', 'FSDP', 'ONNX'],
      answer: 1,
      why: 'FSDP (Fully Sharded Data Parallel) training states GPUs අතර shard කරනවා. DDP වල හැම GPU එකකම සම්පූර්ණ copy එකක් තියෙනවා.',
    },
    {
      q: 'වැස්ස දවස් වල කුඩ විකුණුම් සහ පාරේ අනතුරු දෙකම වැඩියි. "කුඩ නිසා අනතුරු වෙනවා" කියන නිගමනයේ වැරැද්ද මොකක්ද?',
      options: [
        'වැස්ස කියන confounder එක දෙකටම බලපානවා. Correlation එකක් causation එකක් නෙවෙයි',
        'Data ප්‍රමාණය මදි නිසා විතරයි',
        'කුඩ ඇත්තටම අනතුරු වලට ප්‍රධාන හේතුව',
      ],
      answer: 0,
      why: 'වැස්ස කුඩ මිලදී ගැනීමටත්, ලිස්සන පාරවල් නිසා අනතුරු වලටත් බලපානවා. ඒක confounder එකක්.',
    },
    {
      q: 'EU AI Act එක AI systems වර්ග කරන්නේ කොහොමද?',
      options: [
        'Model එකේ parameters ගණන අනුව විතරක්',
        'අවදානම අනුව: unacceptable, high, limited, minimal',
        'Company එක ලියාපදිංචි රට අනුව',
      ],
      answer: 1,
      why: 'EU AI Act risk-based නීතියක්. Unacceptable risk systems තහනම්, high-risk systems වලට දැඩි නීති, limited risk වලට transparency, minimal risk වලට නීති අඩුයි.',
    },
    {
      q: 'Research paper එකක් කියවන three-pass method එකේ පළමු වටයේ කරන්නේ මොකක්ද?',
      options: [
        'හැම equation එකක්ම derive කරන එක',
        'Title, abstract, introduction, headings, conclusion සහ figures බලලා paper එක වැදගත්ද කියලා තීරණය කරන එක',
        'Code එක run කරලා results reproduce කරන එක',
      ],
      answer: 1,
      why: 'පළමු වටය විනාඩි 5-10ක skim එකක්. ගැඹුරු ගණිතය සහ code reproduce කරන එක තුන්වන වටයේ, වැදගත්ම papers වලට විතරයි.',
    },
  ],
}
