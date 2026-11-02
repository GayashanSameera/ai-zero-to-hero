export default {
  id: 'llm',
  number: 5,
  title: 'Transformers & LLMs',
  titleSi: 'Transformers සහ LLMs: ChatGPT, Claude වගේ models ඇතුළේ වෙන්නේ මොකක්ද?',
  summary: 'මේ phase එකේදී ඔයා ChatGPT, Claude, Llama වගේ Large Language Models (LLMs) ඇතුළේ තියෙන Transformer architecture එක, tokens, next-token prediction, sampling, fine-tuning සහ alignment ගැන ගැඹුරින් ඉගෙන ගන්නවා. අද AI ලෝකයේ වැදගත්ම දේවල් ගොඩක් හැදිලා තියෙන්නේ මේ අදහස් උඩ. මේක තේරුණාම "AI එක හිතනවද?" කියන ප්‍රශ්නයට ඔයාටම උත්තරයක් දෙන්න පුළුවන් වෙනවා.',
  duration: 'සති 8-10',
  topics: [
    // 1
    {
      id: 'transformer-intro',
      title: 'Transformer: "Attention Is All You Need"',
      body: [
        '2017 දී Google එකේ researchers ලා කණ්ඩායමක් "Attention Is All You Need" කියලා paper එකක් publish කළා. ඒකෙන් හඳුන්වා දුන්නේ Transformer කියන architecture එක. අද තියෙන GPT, Claude, Llama, Gemini වගේ හැම ලොකු language model එකක්ම වගේ හැදිලා තියෙන්නේ මේ Transformer අදහස උඩ.',
        'Transformer එකට කලින් text handle කරන්න ගොඩක් පාවිච්චි කළේ RNN සහ LSTM වගේ models. ඒවා වචන කියවන්නේ එකින් එක, පිළිවෙළට. ඒ නිසා දෙකක් අවුල්: එකක්, දිග වාක්‍යයක මුල තිබ්බ දේ අගට එනකොට අමතක වෙනවා. දෙක, එකින් එක කරන නිසා GPU එකක parallel විදිහට වේගයෙන් train කරන්න අමාරුයි.',
        'Transformer එක කළේ මේකයි: වාක්‍යයේ හැම වචනයක්ම එකපාර බලනවා. හැම වචනයක්ම අනිත් හැම වචනයක් එක්කම "මට ඔයා කොච්චර වැදගත්ද?" කියලා අහනවා. මේකට කියන්නේ attention කියලා. එකපාර හැම එකම බලන නිසා GPU වල parallel විදිහට ඉක්මනට train කරන්න පුළුවන්. ඒ නිසා තමයි models ලොකු කරන්න, data ගොඩක් දාන්න පුළුවන් වුණේ.',
        'Transformer එකක ප්‍රධාන කොටස්: tokens embeddings බවට හරවන input එක, position එක කියන positional encoding, ඊට පස්සේ එක උඩ එක තියපු Transformer blocks ගොඩක් (හැම block එකකම attention සහ feed-forward කොටස් තියෙනවා), අන්තිමට ඊළඟ token එකට probabilities දෙන output layer එක. ඊළඟ topics වලින් මේ එකින් එක බලමු.',
      ],
      analogy: 'පරණ RNN එක හරියට පන්තියේ ළමයෙක් කතාවක් එක වචනයක් එක වචනයක් කියවලා මතක තියාගන්න උත්සාහ කරනවා වගේ. පිටු 10ක් ගියාම මුල් පිටුවේ නම් අමතකයි. Transformer එක හරියට මුළු පිටුවම මේසේ උඩ දාගෙන, highlighter එකකින් "මේ වචනෙට අදාළ වචන මොනවද" කියලා ඉරි අඳිනවා වගේ. ඕනෑම වචනයකට ඕනෑම වචනයක් එක පාරටම බලන්න පුළුවන්.',
      example: '"කමල් කොළඹ ගියා, ඒත් එයාට bus එක මග ඇරුණා" කියන වාක්‍යය ගන්න. "එයාට" කියන්නේ කාටද? RNN එකකට "කමල්" දුරින් තියෙන නිසා සම්බන්ධය අල්ලගන්න අමාරු වෙන්න පුළුවන්. Transformer එකේ "එයාට" කියන token එක කෙළින්ම "කමල්" token එකට attention දෙනවා. උදාහරණයක් විදිහට attention weight 0.7ක් "කමල්" ට, 0.1ක් "කොළඹ" ට, ඉතුරු ටික අනිත් වචන වලට. ඒ නිසා model එකට තේරෙනවා "එයා = කමල්" කියලා.',
      keyPoints: [
        'Transformer = 2017 "Attention Is All You Need" paper එකෙන් ආපු architecture එක.',
        'වචන එකින් එක නෙවෙයි, හැම එකම එකපාර බලනවා. ඒ නිසා parallel training වේගවත්.',
        'Attention එකෙන් දුර තියෙන වචන අතර සම්බන්ධත් අල්ලගන්නවා.',
        'අද LLMs ඔක්කොම වගේ Transformer මත හැදිලා.',
      ],
      terms: [
        { en: 'Attention Is All You Need', si: '2017 Transformer architecture එක හඳුන්වා දුන්න famous paper එක.' },
        { en: 'Transformer', si: 'Attention මත පදනම් වුණු neural network architecture එක. LLMs වල හදවත.' },
        { en: 'RNN / LSTM', si: 'Transformer එකට කලින් තිබ්බ, වචන එකින් එක කියවන models. දිග text වලදී අමතක වෙනවා.' },
        { en: 'Parallelization', si: 'වැඩ ගොඩක් එකම වෙලාවේ GPU එකේ කරන එක. Transformer එක මේකට හොඳට ගැළපෙනවා.' },
      ],
    },

    // 2
    {
      id: 'self-attention',
      title: 'Self-Attention, Query / Key / Value සහ Multi-Head Attention',
      lab: 'attention',
      body: [
        'Self-attention කියන්නේ වාක්‍යයක් ඇතුළේ හැම token එකක්ම, එම වාක්‍යයේම අනිත් tokens දිහා බලලා "මගේ තේරුම හරියට හදාගන්න මට කාගෙන් කොච්චර තොරතුරු ගන්න ඕනෙද?" කියලා තීරණය කරන ක්‍රමය. "Self" කියන්නේ එකම වාක්‍යය ඇතුළේම බලන නිසා.',
        'මේක කරන්න හැම token එකකින්ම vectors තුනක් හදනවා: Query (Q), Key (K), Value (V). Query = "මම හොයන්නේ මොකක්ද?" කියන ප්‍රශ්නය. Key = "මා ගාව තියෙන්නේ මේ වගේ දෙයක්" කියන label එක. Value = ඇත්තටම දෙන තොරතුරු. එක token එකක Query එක අනිත් හැම token එකකම Key එකත් එක්ක ගළපලා බලනවා. ගැළපීම වැඩි නම් ඒ token එකේ Value එකෙන් ගොඩක් ගන්නවා.',
        'මේ ගැළපීම මනින ක්‍රමයට කියන්නේ Scaled Dot-Product Attention කියලා. පියවර හතරයි: (1) Query එකයි Key එකයි dot product කරලා score එකක් ගන්නවා (vectors දෙක එකම දිශාවට නම් score එක ලොකුයි). (2) ඒ score එක √d_k වලින් බෙදනවා. d_k කියන්නේ Key vector එකේ දිග (අංක කීයක් තියෙනවද). මේකෙන් scores ඕනෑවට වඩා ලොකු වෙන එක නවත්වනවා. ඒක තමයි "scaled". (3) Softmax දාලා scores ඔක්කොම එකතුව 1ක් වෙන weights බවට හරවනවා. (4) ඒ weights වලින් Values වල weighted average එක ගන්නවා. ඒක තමයි ඒ token එකේ අලුත්, context එක දන්න representation එක.',
        'Multi-Head Attention කියන්නේ මේ attention එක එක පාරක් නෙවෙයි, වෙන වෙනම "heads" ගොඩකින් එකවර කරන එක. හැම head එකකටම තමන්ගේම Q, K, V weights තියෙනවා. ඒ නිසා එක head එකක් grammar (කර්තෘ-ක්‍රියාව) බලද්දී, තව head එකක් "එයා" කියන්නේ කාටද කියලා බලන්න පුළුවන්. අන්තිමට heads ඔක්කොගේම output එකට එකතු කරලා (concatenate කරලා) එක vector එකක් කරනවා.',
      ],
      analogy: 'පුස්තකාලයකට ගිහින් ඔයා librarian ට කියනවා "මට cricket ගැන පොතක් ඕනේ" කියලා. ඒක ඔයාගේ Query එක. හැම පොතකම පිටේ ගහලා තියෙන label එක (title, විෂය) තමයි Key එක. පොත ඇතුළේ තියෙන ඇත්ත අන්තර්ගතය තමයි Value එක. Librarian ඔයාගේ ඉල්ලීම label එක්ක ගළපලා, ගැළපෙනම පොත් වලින් වැඩිපුර, අඩුවෙන් ගැළපෙන ඒවායින් ටිකක් අරන් ඔයාට දෙනවා. Google search එකත් ඒ වගේමයි: ඔයා type කරන එක Query, web pages වල keywords Key, page එකේ content එක Value. Multi-head කියන්නේ librarians කිහිප දෙනෙක් වෙන වෙනම කෝණ වලින් (එක්කෙනෙක් විෂය අනුව, තව කෙනෙක් ලියපු කෙනා අනුව) හොයලා දෙන එක.',
      example: '"මල්ලි බත් කෑවා, ඒක රසයි" කියන එකේ "ඒක" token එක ගමු. "ඒක" ගේ Query එක "මම කියන්නේ කුමන දේටද?" කියලා අහනවා. Dot product scores: "මල්ලි" = 2, "බත්" = 6, "කෑවා" = 1, "රසයි" = 3 කියලා හිතමු. Scale කරලා softmax දැම්මාම weights ආසන්න වශයෙන් "බත්" 0.80, "රසයි" 0.12, "මල්ලි" 0.05, "කෑවා" 0.03 වගේ එනවා (එකතුව 1). ඉතින් "ඒක" ගේ අලුත් vector එකෙන් 80%ක්ම එන්නේ "බත්" ගේ Value එකෙන්. Model එකට තේරෙනවා "ඒක = බත්" කියලා.',
      keyPoints: [
        'Self-attention = හැම token එකක්ම අනිත් tokens වලින් කොච්චර තොරතුරු ගන්නද කියලා තීරණය කරන ක්‍රමය.',
        'Query = මම හොයන දේ, Key = මා ගාව තියෙන label එක, Value = දෙන තොරතුරු.',
        'Scaled dot-product: Q·K score → √d_k න් බෙදීම → softmax → Values වල weighted average.',
        'Multi-head = attention එක වෙනස් කෝණ ගොඩකින් එකවර බලන එක.',
      ],
      terms: [
        { en: 'Self-Attention', si: 'එකම sequence එකේ tokens එකිනෙකාට attention දෙන ක්‍රමය.' },
        { en: 'Query (Q)', si: 'Token එකක් "මට මොකක්ද ඕනේ" කියලා අහන vector එක.' },
        { en: 'Key (K)', si: 'Token එකක් "මා ගාව මේක තියෙනවා" කියලා පෙන්නන label vector එක.' },
        { en: 'Value (V)', si: 'Attention වලින් ඇත්තටම අරගෙන යන තොරතුරු vector එක.' },
        { en: 'Scaled Dot-Product Attention', si: 'Q සහ K dot product කරලා √d_k න් බෙදලා softmax දාලා V වල weighted average ගන්න ක්‍රමය.' },
        { en: 'Attention Weights', si: 'එක token එකක් අනිත් එක් එක් token එකට දෙන වැදගත්කම. එකතුව 1යි.' },
        { en: 'Multi-Head Attention', si: 'Attention heads ගොඩක් parallel ව දුවලා, ඒවායේ outputs එකතු කරන එක.' },
      ],
    },

    // 3
    {
      id: 'positional-encoding',
      title: 'Positional Encoding: Sinusoidal, Learned, RoPE',
      body: [
        'Attention එකට ලොකු අඩුවක් තියෙනවා: ඒක tokens ගොඩක් දිහා බලන්නේ "බෑගයක් ඇතුළේ තියෙන බඩු" වගේ. පිළිවෙළ ගැන ඒකට දැනුමක් නෑ. "බල්ලා පූසාව හැපුවා" සහ "පූසා බල්ලාව හැපුවා" කියන දෙකේ එකම වචන තියෙන නිසා positions නොකිව්වොත් attention එකට වෙනස තේරෙන්නේ නෑ. ඒ නිසා හැම token එකකටම "ඔයා ඉන්නේ මෙච්චරවෙනි තැන" කියන තොරතුරු එකතු කරන්න ඕනේ. ඒකට කියන්නේ Positional Encoding.',
        'Sinusoidal positional encoding: original Transformer paper එකේ පාවිච්චි කළේ මේක. sin සහ cos තරංග (waves) විවිධ වේග වලින් පාවිච්චි කරලා හැම position එකකටම අද්විතීය "ඇඟිලි සලකුණක්" වගේ අංක පෙළක් හදනවා. මේක train කරන්න ඕනේ නෑ. ගණිතයෙන්ම හදනවා.',
        'Learned positional embeddings: BERT, මුල් GPT models වගේ ඒවා කළේ මේක. Position 1, 2, 3... හැම එකකටම vector එකක් තියලා, ඒවා training එකේදී model එකම ඉගෙන ගන්නවා. සරලයි, හොඳට වැඩ. ඒත් train කරපු උපරිම දිගට වඩා දිග text එකකට ගියොත් අවුල්.',
        'RoPE (Rotary Position Embedding): අද Llama ඇතුළු ගොඩක් අලුත් models පාවිච්චි කරන්නේ මේ වගේ ක්‍රම. Position එක vector එකට එකතු කරනවා වෙනුවට, Query සහ Key vectors position එක අනුව යම් කෝණයකින් "කරකවනවා" (rotate). එතකොට Q·K score එක රඳා පවතින්නේ tokens දෙක අතර relative දුර මත. "මම ඔයාට පස්සෙන් තැන් 3ක් දුරින්" කියන එක ඉබේම encode වෙනවා. Context window එක දිගු කරන්නත් මේක පහසුයි.',
      ],
      analogy: 'Cricket team එකක batting order එක හිතන්න. Players 11 දෙනාම එකයි. ඒත් opening batsman ද, number 11 ද කියන එක වෙනස් නම් game plan එකම වෙනස්. Positional encoding කියන්නේ හැම player ගේම jersey එකේ number එක මහනවා වගේ. RoPE කියන්නේ "මම ඔයාට පස්සේ තුන්වෙනියට එනවා" වගේ relative පිළිවෙළ මතක තියාගන්න ක්‍රමයක්.',
      example: '"මම ඔයාට ආදරෙයි" කියන tokens 3 ගමු. Positional encoding නැත්නම් model එකට පේන්නේ {මම, ඔයාට, ආදරෙයි} කියන බෑගය විතරයි. Learned encoding එකේදී "මම" ගේ embedding එකට position-1 vector එක, "ඔයාට" ට position-2 vector එක, "ආදරෙයි" ට position-3 vector එක එකතු කරනවා. දැන් "ඔයා මට ආදරෙයි" කියන එක වෙනස් vectors දෙනවා, ඒ නිසා model එකට තේරුමේ වෙනස අල්ලගන්න පුළුවන්.',
      keyPoints: [
        'Attention එකට පිළිවෙළ ගැන දැනුමක් නෑ. Positional encoding එකෙන් ඒක දෙනවා.',
        'Sinusoidal = sin/cos waves වලින් ගණිතයෙන් හදන encoding (original Transformer).',
        'Learned = position එකකට vector එකක්, training එකේදී ඉගෙන ගන්නවා (BERT, මුල් GPT).',
        'RoPE = Q, K vectors position අනුව rotate කරනවා. Relative දුර හොඳට අල්ලනවා, අලුත් models වල ජනප්‍රියයි.',
      ],
      terms: [
        { en: 'Positional Encoding', si: 'Token එකේ ස්ථානය (position) model එකට කියන තොරතුරු.' },
        { en: 'Sinusoidal Encoding', si: 'sin සහ cos waves පාවිච්චි කරලා train නොකර හදන position අංක.' },
        { en: 'Learned Positional Embedding', si: 'හැම position එකකටම training එකේදී ඉගෙන ගන්න vector එකක්.' },
        { en: 'RoPE (Rotary Position Embedding)', si: 'Query සහ Key vectors position අනුව කරකවලා relative position encode කරන ක්‍රමය.' },
      ],
    },

    // 4
    {
      id: 'transformer-block',
      title: 'Transformer Block: Residuals, Feed-Forward, Layer Norm, Causal Masking',
      body: [
        'Transformer එකක් කියන්නේ එකම වගේ "blocks" ගොඩක් එක උඩ එක තියපු එකක්. ලොකු models වල blocks දුසිම් ගණනක් තියෙනවා. හැම block එකකම ප්‍රධාන කොටස් දෙකයි: (1) Multi-head self-attention, tokens අතර තොරතුරු හුවමාරු කරන තැන. (2) Feed-Forward Network (FFN), හැම token එකක්ම තනියම "හිතලා" තේරුම ගැඹුරු කරන තැන. FFN එක සාමාන්‍යයෙන් linear layers දෙකක් සහ මැද activation function එකක්. මැද layer එක input එකට වඩා කිහිප ගුණයක් පළලයි. Model එකේ "දැනුම" ගොඩක් ගබඩා වෙලා තියෙන්නේ මේ FFN weights වල කියලා researchers ලා හිතනවා.',
        'Residual connection (skip connection): හැම කොටසකම output එකට එහි input එකම නැවත එකතු කරනවා. ඒ කියන්නේ "අලුත් දේ = පරණ දේ + වෙනස". මේ නිසා layers ගොඩක් තිබ්බත් gradients හොඳට පස්සට ගලනවා, deep network එකක් train කරන්න පුළුවන් වෙනවා. Layer එකකට මුකුත් කරන්න දෙයක් නැත්නම් ඒකට "වෙනසක් නෑ" කියලා input එක එහෙම්මම යවන්නත් පුළුවන්.',
        'Layer Normalization: හැම token vector එකකම අංක ඕනෑවට වඩා ලොකු හෝ පොඩි නොවී, සමාන පරාසයක තියාගන්න normalize කරනවා. මේකෙන් training එක ස්ථාවර වෙනවා. Original paper එකේ norm එක දැම්මේ කොටසට පස්සේ (Post-LN). අද ගොඩක් models දාන්නේ කොටසට කලින් (Pre-LN), සමහරු RMSNorm කියන සරල වර්ගයක් පාවිච්චි කරනවා.',
        'Causal Masking: GPT වගේ text generate කරන models වලදී, training එකේදී token එකකට පස්සෙන් එන tokens බලන්න දුන්නොත් ඒක "විභාගෙදී answer sheet එක බලනවා" වගේ. ඒ නිසා attention scores වල අනාගත tokens වලට අදාළ තැන් −∞ කරලා (softmax එකෙන් පස්සේ 0 වෙනවා) වහනවා. එතකොට හැම token එකකටම බලන්න පුළුවන් තමන්ට කලින් තියෙන tokens සහ තමන්ව විතරයි. මේකට causal mask හෝ look-ahead mask කියනවා.',
      ],
      analogy: 'Block එකක් හරියට office එකක meeting එකක් සහ ඊට පස්සේ තනි වැඩ වගේ. Attention = meeting එක, හැමෝම අදහස් හුවමාරු කරනවා. Feed-forward = හැමෝම තමන්ගේ මේසෙට ගිහින් තනියම හිතලා වැඩ කරනවා. Residual = පරණ report එක විසි නොකර, ඒකට අලුත් notes එකතු කරනවා. Layer norm = හැමෝම එකම format එකට report ලියනවා. Causal mask = cricket commentator කෙනෙක් වගේ: ඊළඟ ball එකේ මොකද වෙන්නේ කියලා දන්නේ නෑ, දැනට වුණු දේවල් විතරක් බලලා කියනවා.',
      example: 'Tokens 4ක් තියෙනවා: "මම" "කඩේ" "ගියා" "ඊයේ". Causal mask එකත් එක්ක attention බලන්න පුළුවන් දේ: "මම" → {මම}, "කඩේ" → {මම, කඩේ}, "ගියා" → {මම, කඩේ, ගියා}, "ඊයේ" → {ඔක්කොම 4}. ඒ කියන්නේ 4×4 table එකේ diagonal එකට උඩ තියෙන කොටු 6ම වහලා. Residual උදාහරණය: token vector එකේ එක අංකයක් 2.0 යි, attention කොටස එකතු කරන වෙනස 0.3 යි නම්, output = 2.0 + 0.3 = 2.3.',
      keyPoints: [
        'Block එකක් = Attention + Feed-Forward, දෙකටම residual සහ layer norm.',
        'Residual connection = input + වෙනස. Deep networks train කරන්න අත්‍යවශ්‍යයි.',
        'Layer norm = අංක ස්ථාවර පරාසයක තියාගන්නවා. අද ගොඩක් Pre-LN / RMSNorm.',
        'Causal masking = අනාගත tokens බලන්න නොදී වහනවා. Text generate කරන models වලට අනිවාර්යයි.',
      ],
      terms: [
        { en: 'Transformer Block / Layer', si: 'Attention සහ feed-forward කොටස් තියෙන, එක උඩ එක තියන ඒකකය.' },
        { en: 'Feed-Forward Network (FFN / MLP)', si: 'හැම token එකකටම වෙන වෙනම යොදන, linear layers දෙකක් සහ activation එකක් තියෙන කොටස.' },
        { en: 'Residual Connection', si: 'කොටසක output එකට එහි input එකම එකතු කරන shortcut එක.' },
        { en: 'Layer Normalization', si: 'Vector එකක අංක සාමාන්‍ය පරාසයකට ගේන ක්‍රමය. Training ස්ථාවර කරනවා.' },
        { en: 'RMSNorm', si: 'Layer norm එකේ සරල, වේගවත් වර්ගයක්. අලුත් models ගොඩක පාවිච්චි වෙනවා.' },
        { en: 'Causal Masking', si: 'Token එකකට තමන්ට පස්සේ එන tokens බලන්න නොදී attention වහන ක්‍රමය.' },
      ],
    },

    // 5
    {
      id: 'architectures',
      title: 'Encoder-only, Decoder-only, Encoder-Decoder',
      body: [
        'Original Transformer එකේ කොටස් දෙකක් තිබුණා: Encoder (input එක කියවලා තේරුම් ගන්න) සහ Decoder (output එක token එකින් token එක ලියන්න). පස්සේ කාලෙක researchers ලා මේවා වෙන් කරලා, එක් එක් වැඩට ගැළපෙන විදිහට පවුල් තුනක් හැදුවා.',
        'Encoder-only (BERT වගේ): Causal mask එකක් නෑ. හැම token එකක්ම වමටත් දකුණටත් දෙපැත්තටම බලනවා (bidirectional). Train කරන්නේ වාක්‍යයක වචන කිහිපයක් [MASK] කරලා ඒවා අනුමාන කරන්න (Masked Language Modeling). Text එක තේරුම් ගන්න වැඩ වලට ගොඩක් හොඳයි: classification, sentiment analysis, search, embeddings. ඒත් දිග text generate කරන්න හදලා නෑ.',
        'Decoder-only (GPT, Claude, Llama වගේ): Causal mask එක තියෙනවා. කරන්නේ එකම වැඩේ: කලින් tokens බලලා ඊළඟ token එක අනුමාන කරන එක. ඇහෙන්න සරලයි, ඒත් scale කළාම chat, code ලියන එක, පරිවර්තනය, summary ඔක්කොම කරන්න පුළුවන් බව පෙනුණා. අද ප්‍රසිද්ධ chat LLMs ඔක්කොම වගේ decoder-only.',
        'Encoder-Decoder (T5, original Transformer වගේ): Encoder එක input එක සම්පූර්ණයෙන් කියවනවා. Decoder එක output එක ලියද්දී "cross-attention" පාවිච්චි කරලා encoder එකේ තේරුම දිහා බලනවා. Translation, summarization වගේ "එක text එකක් තව text එකකට හරවන" වැඩ වලට හොඳට ගැළපෙනවා. T5 හැම වැඩක්ම "text එකක් දීලා text එකක් ගන්න" ආකාරයට හැදුවා.',
      ],
      analogy: 'Encoder-only = විභාග පත්තරයක් සම්පූර්ණයෙන් කියවලා "මේක ගණිත ප්‍රශ්නයක්" කියලා වර්ග කරන ගුරුවරයා. Decoder-only = කතාවක් කියන ආච්චි, කලින් කියපු දේ මත ඊළඟ වචනය කියනවා. Encoder-Decoder = පරිවර්තකයා: මුලින් ඉංග්‍රීසි ලියුම සම්පූර්ණයෙන් කියවලා තේරුම් ගන්නවා (encoder), ඊට පස්සේ සිංහලෙන් වචනයෙන් වචනය ලියනවා, අතරින් පතර මුල් ලියුම බලනවා (decoder + cross-attention).',
      example: 'Daraz review එකක් "Delivery late, product ok" positive ද negative ද කියලා බලන්න BERT එකක් ගන්න පුළුවන්: output එක label එකක් විතරයි. "කොළඹ ගැන කවියක් ලියන්න" කියන එකට decoder-only model එකක් ගන්නවා: token 1, token 2, ... එකින් එක generate කරනවා. "I love rice and curry" → "මම බත් සහ කරියට ආසයි" වගේ translation එකකට encoder-decoder model එකක් ගැළපෙනවා.',
      keyPoints: [
        'Encoder-only (BERT) = දෙපැත්තටම බලනවා. තේරුම් ගන්න, classify කරන්න හොඳයි.',
        'Decoder-only (GPT, Claude, Llama) = ඊළඟ token එක අනුමාන කරනවා. Generate කරන්න හොඳයි.',
        'Encoder-Decoder (T5) = input එක කියවලා, cross-attention එක්ක output ලියනවා.',
        'අද chat LLMs ගොඩක්ම decoder-only.',
      ],
      terms: [
        { en: 'Encoder', si: 'Input text එක කියවලා තේරුම් vectors බවට හරවන කොටස.' },
        { en: 'Decoder', si: 'Output එක token එකින් token එක generate කරන කොටස.' },
        { en: 'Encoder-only (BERT)', si: 'Bidirectional attention තියෙන, understanding වැඩ වලට හොඳ models.' },
        { en: 'Decoder-only (GPT, Claude, Llama)', si: 'Causal mask එක්ක next-token prediction කරන generative models.' },
        { en: 'Encoder-Decoder (T5)', si: 'Encoder සහ decoder දෙකම තියෙන, text-to-text වැඩ වලට හොඳ models.' },
        { en: 'Masked Language Modeling (MLM)', si: 'වචන කිහිපයක් වහලා ඒවා අනුමාන කරන්න train කරන ක්‍රමය (BERT).' },
        { en: 'Cross-Attention', si: 'Decoder එකේ Query, encoder එකේ Keys/Values එක්ක කරන attention.' },
        { en: 'Bidirectional', si: 'වමටත් දකුණටත් දෙපැත්තටම බලන.' },
      ],
    },

    // 6
    {
      id: 'tokens',
      title: 'Tokens සහ Tokenization: BPE, WordPiece, SentencePiece, tiktoken',
      lab: 'tokenizer',
      body: [
        'LLM එකකට අකුරු හෝ වචන කෙළින්ම තේරෙන්නේ නෑ. ඒකට තේරෙන්නේ අංක විතරයි. ඒ නිසා text එක මුලින්ම පොඩි කෑලි වලට කඩනවා. ඒ කෑල්ලකට කියන්නේ token එකක් කියලා. ඊට පස්සේ හැම token එකකටම vocabulary එකේ තියෙන ID අංකයක් දෙනවා. මේ කඩන වැඩේ කරන tool එකට tokenizer කියනවා. Token එකක් සම්පූර්ණ වචනයක් වෙන්න පුළුවන් ("the"), වචනයක කොටසක් වෙන්න පුළුවන් ("un" + "believ" + "able"), තනි අකුරක් හෝ byte එකක් වෙන්නත් පුළුවන්.',
        'Words vs characters vs tokens: හැම වචනයක්ම වෙනම token එකක් කළොත් vocabulary එක අති විශාලයි, අලුත් වචනයක් ආවොත් හඳුනන්නේ නෑ. හැම අකුරක්ම token එකක් කළොත් vocabulary එක පොඩියි, ඒත් sequences ගොඩක් දිගයි, model එකට වැඩ වැඩියි. Subword tokens කියන්නේ මේ දෙකේ මැද තැන: නිතර එන වචන එක token එකක්, දුර්ලභ වචන කෑලි කිහිපයක්. Vocabulary size එක (සාමාන්‍යයෙන් දස දහස් ගණනේ සිට ලක්ෂ ගණනක් දක්වා) design තීරණයක්.',
        'BPE (Byte Pair Encoding) කියන්නේ ජනප්‍රියම ක්‍රමය. අකුරු වලින් පටන් අරන්, training text එකේ එකට නිතරම එන යුගලය (pair) හොයලා ඒක අලුත් token එකක් කරනවා. ඊට පස්සේ ආයෙත් ඊළඟ නිතර එන යුගලය. Vocabulary එක ඕනේ ප්‍රමාණයට එනකන් මේක දිගටම කරනවා. GPT models පාවිච්චි කරන්නේ bytes මත කරන byte-level BPE. tiktoken කියන්නේ OpenAI එකේ වේගවත් BPE tokenizer library එක. WordPiece (BERT පාවිච්චි කරන) BPE වගේමයි, ඒත් merge එක තෝරන්නේ frequency එකට වඩා likelihood එක වැඩිම කරන විදිහට. SentencePiece (T5 සහ සමහර Llama models) spaces පවා සාමාන්‍ය අකුරක් වගේ සලකලා raw text එකෙන්ම tokenize කරනවා, ඒ නිසා spaces නැති හෝ වෙනස් භාෂා වලටත් හොඳයි.',
        'Special tokens: tokenizer එකේ විශේෂ වැඩ වලට වෙන් කරපු tokens තියෙනවා. BOS (Beginning of Sequence) = text එක පටන් ගත්තා. EOS (End of Sequence) = text එක ඉවරයි, model එක generate කරන එක නවත්තන්නේ මේක ආවාම. PAD = batch එකක sequences එකම දිගට ගන්න හිස් තැන් පුරවන token එක. Chat models වලට "user කතා කරනවා", "assistant කතා කරනවා" කියලා වෙන් කරන special tokens ද තියෙනවා.',
      ],
      analogy: 'Kottu එකක් හදනවා හිතන්න. Roti එක සම්පූර්ණයෙන් දැම්මොත් (හැම වචනයක්ම token එකක්) කන්න අමාරුයි. Roti එක කුඩු කරලා පිටි වගේ කළොත් (හැම අකුරක්ම token එකක්) kottu එකක් නෙවෙයි. කොත්තු බාස් කපන්නේ හරි මැද ප්‍රමාණයට, ඒක තමයි subword tokens. BPE කියන්නේ කඩේ නිතරම එකට විකිණෙන බඩු (පාන් + පොල් සම්බෝල) එකට pack කරලා "combo" එකක් හදනවා වගේ.',
      example: 'BPE merge උදාහරණයක්: training text එකේ "hug" 10 පාරක්, "pug" 5 පාරක්, "hugs" 5 පාරක් තියෙනවා. මුලින් අකුරු: h u g / p u g / h u g s. යුගල ගණන් කරමු: "u g" = 10+5+5 = 20, "h u" = 10+5 = 15, "p u" = 5, "g s" = 5. වැඩියෙන්ම එන්නේ "u g", ඒ නිසා merge 1: "ug" කියලා අලුත් token එකක්. දැන්: h ug / p ug / h ug s. ආයෙත් ගණන් කරමු: "h ug" = 15, "p ug" = 5, "ug s" = 5. Merge 2: "hug". දැන් "hugs" කියන එක tokens 2යි: "hug" + "s". "bugs" වගේ කවදාවත් නොදැකපු වචනයක් ආවත් "b" + "ug" + "s" කියලා කඩන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `import tiktoken

# OpenAI models පාවිච්චි කරන BPE tokenizer එකක් load කරනවා
enc = tiktoken.get_encoding("cl100k_base")

texts = ["I love rice and curry", "මම බත් කන්න ආසයි"]
for t in texts:
    ids = enc.encode(t)                 # text එක token IDs වලට හරවනවා
    print(t, "->", len(ids), "tokens")  # token ගණන
    print(ids)                          # ID අංක ලැයිස්තුව

# IDs ආපහු text එකට හරවන්නත් පුළුවන්
print(enc.decode(enc.encode("hello world")))`,
      },
      keyPoints: [
        'Token = LLM එකක් කියවන text කෑල්ල. වචනයක්, වචන කොටසක්, අකුරක් හෝ byte එකක් වෙන්න පුළුවන්.',
        'Subword tokenization = වචන සහ අකුරු අතර හොඳම මැද තැන.',
        'BPE = නිතරම එකට එන යුගල නැවත නැවත merge කරනවා. tiktoken, WordPiece, SentencePiece මේ පවුලේ tools.',
        'BOS, EOS, PAD වගේ special tokens වලට විශේෂ වැඩ තියෙනවා.',
      ],
      terms: [
        { en: 'Token', si: 'Model එක කියවන / ලියන කුඩාම text ඒකකය.' },
        { en: 'Tokenization / Tokenizer', si: 'Text එක tokens වලට කඩලා IDs දෙන ක්‍රියාවලිය සහ ඒක කරන tool එක.' },
        { en: 'Tokens vs Words vs Characters', si: 'වචන මට්ටම = vocabulary විශාලයි. අකුරු මට්ටම = sequences දිගයි. Subword tokens = මැද තැන.' },
        { en: 'BPE (Byte Pair Encoding)', si: 'නිතරම එකට එන අකුරු/කෑලි යුගල merge කරලා vocabulary හදන ක්‍රමය.' },
        { en: 'WordPiece', si: 'BERT පාවිච්චි කරන, likelihood එක අනුව merge තෝරන BPE වගේ ක්‍රමයක්.' },
        { en: 'SentencePiece', si: 'Spaces ද අකුරක් ලෙස සලකලා raw text එකෙන්ම tokenize කරන library එක. භාෂා ගොඩකට හොඳයි.' },
        { en: 'tiktoken', si: 'OpenAI එකේ වේගවත් BPE tokenizer library එක.' },
        { en: 'Vocabulary Size', si: 'Tokenizer එක දන්න වෙනස් tokens ගණන.' },
        { en: 'BOS / EOS / PAD', si: 'පටන් ගැනීම, අවසානය, හිස් තැන් පිරවීම සඳහා special tokens.' },
        { en: 'Special Tokens', si: 'සාමාන්‍ය text නොවන, පාලන වැඩ වලට වෙන් කරපු tokens.' },
      ],
    },

    // 7
    {
      id: 'context-and-cost',
      title: 'Context Window, Token Limits සහ Token Cost',
      body: [
        'Context window කියන්නේ model එකකට එක පාරකට "බලාගෙන ඉන්න" පුළුවන් උපරිම tokens ගණන. ඔයාගේ prompt එක, කලින් chat messages, දාපු documents, model එක ලියන උත්තරය ඔක්කොම මේ සීමාව ඇතුළට වැටෙන්න ඕනේ. සීමාව පැන්නොත් පරණ කොටස් කපලා දාන්න වෙනවා, නැත්නම් request එක fail වෙනවා. ඒක තමයි token limit එක. සමහර APIs වල output එකට වෙනම උපරිම token ගණනක් (max output tokens) ද තියෙනවා.',
        'Context window දිග වැඩි වෙන්න වැඩි වෙන්න attention ගණනය කිරීම් සහ memory ඉක්මනට වැඩි වෙනවා. සාමාන්‍ය attention එකේ tokens දෙගුණ කළොත් attention වැඩ ආසන්න වශයෙන් හතර ගුණයක් වෙනවා. ඒ නිසා දිග context කියන්නේ වියදම් සහ වේලාව වැඩි වීමක්. තවත්, context එක දිග වුණාම මැද තියෙන තොරතුරු model එක සමහර වෙලාවට හරියට පාවිච්චි නොකරන්නත් පුළුවන්.',
        'Token cost: LLM APIs ගාස්තු අය කරන්නේ වචන වලට නෙවෙයි, tokens වලට. සාමාන්‍යයෙන් මිල දෙන්නේ tokens මිලියනයකට මෙච්චර කියලා. Input tokens (ඔයා යවන prompt එක) සහ output tokens (model එක ලියන උත්තරය) වෙන වෙනම ගණන් කරනවා. Output tokens සාමාන්‍යයෙන් input tokens වලට වඩා ගණන් වැඩියි, මොකද output එක token එකින් token එක, එකින් එක generate කරන්න ඕනේ. මිල ගණන් models අතරත් කාලයත් එක්කත් නිතර වෙනස් වෙනවා.',
        'සිංහල text වලට tokens වැඩියෙන් යන්නේ ඇයි? ගොඩක් tokenizers train කරලා තියෙන්නේ ඉංග්‍රීසි ප්‍රමුඛ data වලින්. ඒ නිසා ඉංග්‍රීසි වචන ගොඩක් එක token එකක් බවට merge වෙලා. සිංහල text training data වල අඩු නිසා merges අඩුයි. ඒ වගේම UTF-8 වල සිංහල අකුරක් bytes 3කින් ලියවෙන නිසා (ඉංග්‍රීසි අකුරක් byte 1යි), byte-level BPE එකකදී සිංහල වචනයක් tokens ගොඩකට කැඩෙන්න පුළුවන්. ප්‍රතිඵලය: එකම අදහස සිංහලෙන් කිව්වාම ඉංග්‍රීසියට වඩා බොහෝ විට කිහිප ගුණයක tokens. ඒ කියන්නේ වැඩි වියදම, context window එකේ ඉඩ ඉක්මනට ඉවර වීම, සමහර විට වේගය අඩු වීම. අලුත් tokenizers වල මේ තත්ත්වය ක්‍රමයෙන් හොඳ වෙනවා.',
      ],
      analogy: 'Context window එක හරියට A/L විභාගෙදී දෙන answer sheet එක වගේ. පිටු ගණන සීමිතයි. ප්‍රශ්න පත්තරේ (input) සහ ඔයාගේ උත්තර (output) දෙකම ඒ ඉඩේ තියෙන්න ඕනේ. Token cost එක tuk-tuk meter එක වගේ: දුර (tokens) අනුව ගෙවනවා. සිංහල text කියන්නේ කොළඹ traffic එකේ යනවා වගේ: එකම තැනට ගියත් meter එක වැඩියෙන් කැරකෙනවා.',
      example: 'ඉංග්‍රීසියට ප්‍රචලිත rule of thumb එක: token 1ක් ≈ අකුරු 4ක් පමණ, එහෙමත් නැත්නම් වචන 100ක් ≈ tokens 130-ක් පමණ. හිතමු API එකක input tokens මිලියනයකට ඩොලර් 1යි, output tokens මිලියනයකට ඩොලර් 4යි කියලා (මේවා උදාහරණ අංක විතරයි). ඔයා tokens 2,000ක prompt එකක් යවලා tokens 500ක උත්තරයක් ගන්නවා: input = 2,000 ÷ 1,000,000 × 1 = $0.002, output = 500 ÷ 1,000,000 × 4 = $0.002, එකතුව $0.004. එකම prompt එක සිංහලෙන් tokens 3 ගුණයක් ගියොත්, input කොටස $0.006 වෙනවා. Requests ලක්ෂ ගණනක් යවන app එකකට මේ වෙනස ලොකු මුදලක්.',
      keyPoints: [
        'Context window = එක පාරකට model එකට බලන්න පුළුවන් උපරිම tokens (input + output).',
        'Pricing = tokens අනුව. Input සහ output වෙන වෙනම, output සාමාන්‍යයෙන් වැඩි මිලයි.',
        'දිග context = වැඩි ගණනය කිරීම්, වැඩි memory, වැඩි මිල.',
        'සිංහල text සාමාන්‍යයෙන් ඉංග්‍රීසියට වඩා tokens වැඩියෙන් ගන්නවා: tokenizer data අඩුකම සහ UTF-8 bytes 3 නිසා.',
      ],
      terms: [
        { en: 'Context Window', si: 'Model එකකට එකවර handle කරන්න පුළුවන් උපරිම tokens ගණන.' },
        { en: 'Token Limit', si: 'Context එකට හෝ output එකට තියෙන උපරිම token සීමාව.' },
        { en: 'Token Cost / Pricing', si: 'API භාවිතයට tokens ගණන අනුව අය කරන ගාස්තුව.' },
        { en: 'Input Tokens', si: 'ඔයා model එකට යවන prompt එකේ සහ context එකේ tokens.' },
        { en: 'Output Tokens', si: 'Model එක generate කරන උත්තරයේ tokens. සාමාන්‍යයෙන් වැඩි මිලයි.' },
        { en: 'UTF-8', si: 'අකුරු bytes බවට හරවන encoding එක. සිංහල අකුරකට bytes 3ක්.' },
      ],
    },

    // 8
    {
      id: 'next-token-prediction',
      title: 'Next-Token Prediction: Embeddings, Logits, Softmax',
      body: [
        'LLM එකක් කරන මූලිකම වැඩේ පුදුම සරලයි: "මේ tokens වලට පස්සේ එන්න වැඩිම ඉඩ තියෙන token එක මොකක්ද?" කියලා අනුමාන කරන එක. ඒකට කියන්නේ next-token prediction. Text එකක probabilities model කරන මේ වැඩේට language modeling කියනවා. Model එක token එකක් predict කරලා, ඒක input එකට එකතු කරලා, ආයෙත් ඊළඟ token එක predict කරනවා. මේ loop එකෙන් තමයි මුළු උත්තරයම එන්නේ. මේ විදිහට එකින් එක ලියන එකට autoregressive generation කියනවා.',
        'පියවර 1, Embeddings: හැම token ID එකක්ම embedding table එකකින් දිග අංක ලැයිස්තුවකට (vector එකකට) හරවනවා. මේ vectors ජීවත් වෙන්නේ dimensions සිය ගණනක් හෝ දහස් ගණනක් තියෙන "embedding space" එකක. ඒ space එකේ සමාන තේරුම් තියෙන tokens ළඟ ළඟ තියෙනවා: "රජා" සහ "රැජින" ළඟයි, "රජා" සහ "කොත්තු" දුරයි. මේ තේරුම් model එක training එකේදී තනියම ඉගෙන ගන්නවා.',
        'පියවර 2-3, Logits: Vectors Transformer blocks හරහා ගියාට පස්සේ, අන්තිම token එකේ vector එක output layer එකකින් vocabulary එකේ හැම token එකකටම එක score එක ගානේ දෙනවා. මේ raw scores වලට logits කියනවා. Logit එකක් ඍණ වෙන්නත් පුළුවන්, ඕනෑම ලොකු අංකයක් වෙන්නත් පුළුවන්.',
        'පියවර 4, Softmax: Logits probabilities බවට හරවන්න softmax පාවිච්චි කරනවා. Softmax කරන්නේ: හැම logit එකක්ම exponent කරලා (ලොකු එක තවත් ලොකු කරලා) ධන අංකයක් කරනවා, ඊට පස්සේ ඔක්කොගේම එකතුවෙන් බෙදනවා. ප්‍රතිඵලය: හැම token එකකටම 0ත් 1ත් අතර probability එකක්, ඔක්කොගේම එකතුව 1යි. ඊළඟට මේ probability distribution එකෙන් token එකක් තෝරනවා. ඒ කොහොමද කියන එක ඊළඟ topic එකේ (decoding).',
      ],
      analogy: 'ඔයාගේ phone එකේ keyboard එකේ next-word suggestion එක මතකද? "Good" type කළාම "morning" කියලා පෙන්නනවා. LLM එකක් කියන්නේ ඒකේම අති විශාල, අති දක්ෂ version එකක්. Embedding space එක හරියට ලංකා සිතියමක් වගේ: කොළඹ සහ දෙහිවල ළඟයි, කොළඹ සහ යාපනය දුරයි. තේරුමින් ළඟ වචන සිතියමේ ළඟින් තියෙනවා.',
      example: '"අම්මා කුස්සියේ ___" කියන එකට model එක logits දෙනවා: "උයනවා" = 4.0, "ඉන්නවා" = 3.0, "නටනවා" = 0.5. Softmax: e^4.0 ≈ 54.6, e^3.0 ≈ 20.1, e^0.5 ≈ 1.6. එකතුව ≈ 76.3. Probabilities: "උයනවා" ≈ 54.6/76.3 ≈ 0.72, "ඉන්නවා" ≈ 0.26, "නටනවා" ≈ 0.02. එකතුව 1යි. මෙතන e කියන්නේ ආසන්න වශයෙන් 2.718 වන ගණිත නියතයක්. e^x කියන්නේ x ලොකු වෙනකොට ඉක්මනට ලොකු වෙන අංකයක්.',
      keyPoints: [
        'LLM එකක හරය = ඊළඟ token එක අනුමාන කිරීම, නැවත නැවත.',
        'Embedding = token එකක් තේරුම රැගත් vector එකක්. සමාන තේරුම් ළඟ ළඟ.',
        'Logits = හැම token එකකටම raw score. Softmax = ඒවා එකතුව 1ක් වෙන probabilities කරනවා.',
        'Autoregressive = ලියපු token එක ආපහු input එකට දාලා ඊළඟ එක ලියනවා.',
      ],
      terms: [
        { en: 'Next-Token Prediction', si: 'කලින් tokens බලලා ඊළඟ token එක අනුමාන කිරීම.' },
        { en: 'Language Modeling', si: 'Text එකක ඊළඟට එන දේවල probabilities ඉගෙන ගැනීම.' },
        { en: 'Autoregressive Generation', si: 'Token එකින් එක, කලින් ලියපු ඒවා මත ඊළඟ එක ලියන ක්‍රමය.' },
        { en: 'Embedding', si: 'Token එකක තේරුම නියෝජනය කරන අංක vector එක.' },
        { en: 'Embedding Space', si: 'Embeddings තියෙන බහු-මාන අවකාශය. සමාන තේරුම් ළඟ ළඟ.' },
        { en: 'Logits', si: 'Softmax එකට කලින් output layer එක දෙන raw scores.' },
        { en: 'Softmax', si: 'Scores, 0-1 අතර සහ එකතුව 1ක් වෙන probabilities බවට හරවන function එක.' },
        { en: 'Probability Distribution', si: 'හැම විය හැකි token එකකටම දෙන සම්භාවිතා ලැයිස්තුව.' },
      ],
    },

    // 9
    {
      id: 'decoding-sampling',
      title: 'Decoding සහ Sampling: Greedy, Beam, Temperature, Top-k, Top-p',
      lab: 'temperature',
      body: [
        'Model එක probabilities දුන්නාට පස්සේ, ඇත්තටම කුමන token එකද තෝරන්නේ කියලා තීරණය කරන ක්‍රමයට decoding strategy එකක් කියනවා. එකම model එකේ වුණත් decoding ක්‍රමය වෙනස් කළාම උත්තරේ ගතිය සම්පූර්ණයෙන් වෙනස් වෙනවා.',
        'Greedy decoding: හැම පාරම වැඩිම probability එක තියෙන token එක තෝරනවා. සරලයි, හැම පාරම එකම උත්තරය. ඒත් සමහර විට එකම වාක්‍ය නැවත නැවත එනවා, නීරසයි. Beam search: එක පාරකට හොඳම sequences කිහිපයක් (beam width එක, උදා: 4ක්) පවත්වාගෙන ගිහින්, අන්තිමට මුළු sequence එකේම probability එක වැඩිම එක තෝරනවා. Translation වගේ "එක හරි උත්තරයක්" තියෙන වැඩ වලට හොඳයි. Chat එකක නිර්මාණශීලී text වලට එච්චර ගැළපෙන්නේ නෑ.',
        'Sampling: probabilities අනුව අහඹු ලෙස token එකක් තෝරනවා, ලොතරැයියක් වගේ. Temperature කියන්නේ මේ ලොතරැයිය පාලනය කරන knob එක. Softmax එකට කලින් logits temperature එකෙන් බෙදනවා. Temperature අඩුයි (උදා: 0.2) = ඉහළම token එක තවත් ප්‍රබල වෙනවා, උත්තර ස්ථාවරයි, ප්‍රවේශම්. Temperature 0 = ප්‍රායෝගිකව greedy. Temperature වැඩියි (උදා: 1.5) = distribution එක පැතලි වෙනවා, දුර්ලභ tokens වලටත් ඉඩ, නිර්මාණශීලී ඒත් සමහර විට විකාර.',
        'Top-k sampling: වැඩිම probability තියෙන tokens k ගණන විතරක් තියාගෙන, අනිත් ඒවා අයින් කරලා, ඒ ටික ඇතුළෙන් sample කරනවා. Top-p (nucleus) sampling: probabilities ලොකු එකේ සිට පිළිවෙළට එකතු කරගෙන ගිහින්, එකතුව p (උදා: 0.9) ට ළඟා වෙනකන් අවශ්‍ය අඩුම tokens ගණන තියාගන්නවා. Model එක විශ්වාසයෙන් ඉන්නකොට tokens ටිකයි, අවිනිශ්චිත වෙලාවට tokens ගොඩයි. ඒ නිසා top-p, top-k ට වඩා අනුවර්තනශීලීයි. ප්‍රායෝගිකව temperature එකයි top-p හෝ top-k එකයි එකට පාවිච්චි කරනවා.',
      ],
      analogy: 'ඔයා Colombo වල lunch එකට තැනක් තෝරනවා. Greedy = හැමදාම ඔයාගේ favourite බත් කඩේටම යනවා. Temperature අඩුයි = ගොඩක් වෙලාවට favourite එකට, ඉඳලා හිටලා දෙවෙනි එකට. Temperature වැඩියි = අහඹු ලෙස ඕනෑම තැනකට, සමහර දවසක අමුතු කඩේකට. Top-k = "හොඳම කඩ 3 න් එකක් විතරයි" කියලා සීමා කරනවා. Top-p = "මගේ කැමැත්තෙන් 90%ක් ආවරණය වෙන කඩ ටික අතරින් විතරයි". Beam search = යන්න කලින් route කිහිපයක්ම සැලසුම් කරලා හොඳම මුළු ගමන තෝරනවා.',
      example: '"මට බඩගිනියි, මම කන්නේ ___" කියන එකට probabilities: බත් 0.50, කොත්තු 0.30, ඉඳිආප්ප 0.15, කේක් 0.05. Greedy = හැම පාරම "බත්". Top-k (k=2) = "බත්" සහ "කොත්තු" විතරක් තියාගෙන 0.50/0.80 = 0.625 සහ 0.30/0.80 = 0.375 ලෙස නැවත බෙදලා sample කරනවා. Top-p (p=0.9) = 0.50 + 0.30 = 0.80 (තාම 0.9 ට අඩුයි), + 0.15 = 0.95 (දැන් 0.9 පැන්නා), ඉතින් බත්, කොත්තු, ඉඳිආප්ප තියාගන්නවා, කේක් අයින්. Temperature අඩු කළොත් "බත්" ගේ probability එක 0.50 සිට 0.80 වගේ වෙන්න පුළුවන්. වැඩි කළොත් හතරම 0.25 ට ළං වෙනවා.',
      keyPoints: [
        'Greedy = හැම පාරම ඉහළම token එක. Beam search = හොඳම sequences කිහිපයක් පවත්වාගෙන යනවා.',
        'Temperature අඩු = ස්ථාවර, ප්‍රවේශම්. වැඩි = නිර්මාණශීලී, අවදානම්.',
        'Top-k = ඉහළම k tokens අතරින් විතරයි. Top-p = cumulative probability p වෙනකන් tokens අතරින්.',
        'Code, facts වලට අඩු temperature. කවි, ideas වලට ටිකක් වැඩි temperature.',
      ],
      terms: [
        { en: 'Decoding Strategy', si: 'Probabilities වලින් ඇත්තටම token එක තෝරන ක්‍රමය.' },
        { en: 'Greedy Decoding', si: 'හැම පියවරකම වැඩිම probability එක තියෙන token එක තෝරන එක.' },
        { en: 'Beam Search', si: 'හොඳම partial sequences කිහිපයක් එකවර පවත්වාගෙන යන ක්‍රමය.' },
        { en: 'Sampling', si: 'Probabilities අනුව අහඹු ලෙස token එකක් තෝරන එක.' },
        { en: 'Temperature', si: 'Softmax එකට කලින් logits බෙදන අංකය. Distribution එක තියුණු හෝ පැතලි කරනවා.' },
        { en: 'Top-k Sampling', si: 'ඉහළම k tokens අතරින් විතරක් sample කිරීම.' },
        { en: 'Top-p (Nucleus) Sampling', si: 'Cumulative probability එක p ට ළඟා වෙන අඩුම tokens කට්ටලයෙන් sample කිරීම.' },
      ],
    },

    // 10
    {
      id: 'pretraining-scale-inference',
      title: 'Pretraining, Scaling Laws, Emergent Abilities සහ KV Cache',
      body: [
        'Pretraining කියන්නේ LLM එකක පළමු සහ විශාලතම training අදියර. Internet එකෙන්, පොත් වලින්, code වලින් එකතු කරපු tokens ට්‍රිලියන ගණනක text එකක් පුරාම model එකට next-token prediction කරන්න දෙනවා. කවුරුවත් labels දාන්න ඕනේ නෑ, ඊළඟ token එක තමයි label එක (self-supervised learning). මේ අදියරේදී model එක grammar, ලෝකය ගැන facts, තර්කනයේ රටා, code ලියන හැටි වගේ දේවල් ඉබේම ඉගෙන ගන්නවා. ඒත් pretraining විතරක් කළ "base model" එකක් ප්‍රශ්න වලට හොඳට උත්තර දෙන assistant කෙනෙක් නෙවෙයි, ඒක text දිගටම ලියන කෙනෙක් විතරයි.',
        'Parameters කියන්නේ model එකේ ඉගෙන ගන්න weights. ලොකු LLMs වල parameters බිලියන ගණනක් තියෙනවා. Scaling laws කියන්නේ researchers ලා සොයාගත්ත රටාවක්: parameters, training data ප්‍රමාණය, compute එක වැඩි කරද්දී loss එක පුරෝකථනය කරන්න පුළුවන් විදිහට, සුමටව අඩු වෙනවා. වැදගත් පාඩමක්: model එක ලොකු කරනවා නම් data ප්‍රමාණයත් සමානුපාතිකව වැඩි කරන්න ඕනේ. Parameters විතරක් වැඩි කළාට data මදි නම් compute එක නාස්තියි.',
        'Emergent abilities: සමහර හැකියාවන් (උදා: පියවර කිහිපයක ගණිත ගැටලු, අලුත් වැඩක් උදාහරණ කිහිපයකින් අල්ලගැනීම) පොඩි models වල නැතුව, ලොකු models වල හදිසියේ මතු වෙනවා වගේ පෙනුණා. ඒත් සමහර researchers ලා පෙන්නලා තියෙනවා මේ "හදිසි පැනීම" ගොඩක් වෙලාවට මනින metric එකේ ස්වභාවය නිසා පෙනෙන දෙයක් කියලා. දක්ෂතාවය ඇත්තටම ක්‍රමයෙන් වැඩි වෙනවා වෙන්නත් පුළුවන්. ඉතින් මේක තාම විවාදයට ලක්වෙන මාතෘකාවක්.',
        'Training vs Inference: Training කියන්නේ weights වෙනස් කරමින් model එක ඉගැන්වීම. ගොඩක් GPUs, සති හෝ මාස, ගොඩක් මුදල්. Inference කියන්නේ train කරපු model එක පාවිච්චි කරලා උත්තර ලබාගැනීම. weights වෙනස් වෙන්නේ නෑ. Inference වලදී token එකින් එක generate කරද්දී, කලින් tokens වල Keys සහ Values හැම පාරම ආයෙත් ගණනය කරන එක නාස්තියක්. KV cache එකෙන් ඒවා memory එකේ ගබඩා කරලා තියාගෙන, අලුත් token එකට විතරක් අලුතෙන් ගණනය කරනවා. මේකෙන් generation එක ගොඩක් වේගවත් වෙනවා. ඒත් context එක දිග වෙන්න වෙන්න KV cache එකට ඕනේ memory එකත් වැඩි වෙනවා.',
      ],
      analogy: 'Pretraining = ළමයෙක් අවුරුදු ගණනක් පුස්තකාලයේ හැම පොතක්ම කියවනවා වගේ. Scaling laws = "පාඩම් කරන පැය සහ පොත් ගණන වැඩි කරද්දී ලකුණු පුරෝකථනය කරන්න පුළුවන් විදිහට වැඩි වෙනවා" කියන එක. KV cache = ගණන් හදද්දී කලින් පියවරවල උත්තර කොළේ ලියලා තියාගන්නවා වගේ. හැම පාරම මුල ඉඳන් ගණන් කරන්න ඕනේ නෑ.',
      example: 'Tokens 100ක උත්තරයක් generate කරනවා හිතන්න. KV cache නැත්නම් token 1 ට 1ක්, token 2 ට කලින් එකත් එක්ක 2ක්, ... token 100 ට 100ක් ලෙස tokens ගණනය කරන්න වෙනවා: එකතුව 1+2+...+100 = 5,050ක්. KV cache එක්ක හැම පියවරකම අලුත් token එක 1ක් විතරක් ගණනය කරලා කලින් ඒවායේ K, V cache එකෙන් ගන්නවා: ආසන්න වශයෙන් 100ක් විතරයි. වැඩ කොටස 50 ගුණයක් පමණ අඩුයි (attention එකේ cache එක කියවන වැඩ නම් තාමත් තියෙනවා).',
      keyPoints: [
        'Pretraining = විශාල text ප්‍රමාණයක next-token prediction. Base model එකක් හැදෙනවා.',
        'Scaling laws = params, data, compute වැඩි කරද්දී loss එක පුරෝකථනය කළ හැකි ලෙස අඩු වෙනවා.',
        'Emergent abilities = ලොකු models වල මතු වෙන හැකියාවන්. ඒත් විවාදාත්මකයි.',
        'Inference = model එක පාවිච්චි කිරීම. KV cache එක generation එක වේගවත් කරනවා, memory වැය කරලා.',
      ],
      terms: [
        { en: 'Pretraining', si: 'විශාල unlabeled text එකක් මත next-token prediction කරලා මූලික model එක හදන අදියර.' },
        { en: 'Self-Supervised Learning', si: 'Data එකෙන්ම labels හදාගෙන ඉගෙන ගැනීම (ඊළඟ token එක = label).' },
        { en: 'Base Model', si: 'Pretraining විතරක් කළ, instructions පිළිපදින්න තාම පුහුණු නොකළ model එක.' },
        { en: 'Parameters', si: 'Model එකේ ඉගෙන ගන්න weights සහ biases. ලොකු LLMs වල බිලියන ගණනක්.' },
        { en: 'Scaling Laws', si: 'Model size, data, compute එක්ක performance එක වෙනස් වෙන පුරෝකථනය කළ හැකි රටා.' },
        { en: 'Emergent Abilities', si: 'Scale එක වැඩි වෙද්දී මතු වෙනවා වගේ පෙනෙන අලුත් හැකියාවන්.' },
        { en: 'Inference', si: 'Train කරපු model එකෙන් outputs ලබාගැනීම. Weights වෙනස් වෙන්නේ නෑ.' },
        { en: 'Training', si: 'Data වලින් weights යාවත්කාලීන කරමින් model එක ඉගැන්වීම.' },
        { en: 'KV Cache', si: 'කලින් tokens වල Keys සහ Values ගබඩා කරලා නැවත ගණනය වැළැක්වීම.' },
        { en: 'Compute', si: 'Training/inference සඳහා යොදන ගණනය කිරීම් ප්‍රමාණය (GPU පැය ආදිය).' },
      ],
    },

    // 11
    {
      id: 'hallucinations',
      title: 'Hallucinations: LLMs බොරු කියන්නේ ඇයි?',
      body: [
        'Hallucination කියන්නේ LLM එකක් ඇත්තටම වැරදි හෝ නොපවතින දෙයක් ඉතා විශ්වාසයෙන්, හරි වගේ ලියන එක. නැති පොත් නම්, නැති research papers, වැරදි දින, නැති නීති වගන්ති, නැති code functions වගේ දේවල්. භයානක කොටස තමයි ඒවා කියන විලාසය ඇත්ත දේවල් කියන විලාසයටම සමානයි.',
        'ප්‍රධාන හේතුව: model එක train කළේ "ඇත්ත කියන්න" නෙවෙයි, "ඊළඟට එන්න වැඩිම ඉඩ තියෙන, ස්වභාවික වගේ පේන token එක ලියන්න". ඇත්ත දන්නේ නැති තැනක වුණත්, ඇත්ත වගේ පේන text එකක් ලියන එක model එකට ගොඩක් ලේසියි. Model එකේ දැනුම weights ඇතුළේ "සම්පීඩිත" වෙලා තියෙන්නේ, database එකක් වගේ හරියටම නෙවෙයි. ඒ නිසා දුර්ලභ facts (පොඩි ගමක විස්තර, අඩුවෙන් ප්‍රසිද්ධ අයගේ විස්තර) ගොඩක් වෙලාවට පැටලෙනවා.',
        'තවත් හේතු: training data වල වැරදි තිබීම; knowledge cutoff එකට පස්සේ වුණු දේවල් model එක නොදන්නා බව; sampling අහඹුකම (temperature වැඩි නම් අවදානම වැඩියි); සමහර training ක්‍රම "මම දන්නේ නෑ" කියනවාට වඩා උත්තරයක් දෙන එකට ත්‍යාග දීම; ප්‍රශ්නයම වැරදි උපකල්පනයක් මත තිබීම.',
        'අඩු කරගන්න ක්‍රම: RAG (විශ්වාසදායක documents හොයලා prompt එකට දාන එක), model එකට sources cite කරන්න කියන එක, "විශ්වාස නැත්නම් දන්නේ නෑ කියන්න" කියලා උපදෙස් දීම, අඩු temperature, වැදගත් දේවල් මිනිසෙක් check කිරීම. Hallucination සම්පූර්ණයෙන් නැති කරන්න තාම බෑ. ඒ නිසා වැදගත් තීරණ වලට LLM output එක verify කරන්නම ඕනේ.',
      ],
      analogy: 'Viva එකකදී උත්තරේ නොදන්න ශිෂ්‍යයෙක් හිතන්න. "දන්නේ නෑ" කිව්වොත් ලකුණු නෑ කියලා හිතලා, ඇත්ත වගේ ඇහෙන උත්තරයක් විශ්වාසයෙන් කියනවා. වචන ලස්සනයි, ශබ්දය විශ්වාසයි, ඒත් අන්තර්ගතය වැරදියි. LLM hallucination එකත් ඒ වගේමයි.',
      example: 'ඔයා අහනවා "2015 දී මහනුවර ලියපු \'කඳුකරයේ ගීතය\' පොතේ කතුවරයා කවුද?" කියලා. ඒ නමින් පොතක් නැත්නම් වුණත්, model එක "ඒ පොත ලිව්වේ ආචාර්ය ප්‍රසන්න බණ්ඩාර" වගේ ඇත්ත වගේ නමක් හදලා දෙන්න පුළුවන්. මොකද "පොතේ කතුවරයා" කියන රටාවට පස්සේ සිංහල නමක් එන එක ඉහළ probability එකක්. ප්‍රතිකර්මය: "විශ්වාස නැත්නම් කියන්න" කියලා prompt එකේ දාන්න, නැත්නම් පුස්තකාල catalog එකක් RAG එකෙන් දෙන්න.',
      keyPoints: [
        'Hallucination = වැරදි හෝ නැති දෙයක් විශ්වාසයෙන් කීම.',
        'මූල හේතුව: model එක ඉගෙන ගත්තේ "ඇත්ත" නෙවෙයි, "ස්වභාවික වගේ පේන ඊළඟ token එක".',
        'දුර්ලභ facts, knowledge cutoff, වැරදි data, sampling අහඹුකම අවදානම වැඩි කරනවා.',
        'RAG, citations, අඩු temperature, මිනිස් පරීක්ෂාව වලින් අඩු කරගන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Hallucination', si: 'Model එක විශ්වාසයෙන් වැරදි හෝ නොපවතින තොරතුරු ලියන එක.' },
        { en: 'Knowledge Cutoff', si: 'Model එකේ training data අවසන් වෙන දිනය. ඊට පස්සේ දේවල් ඒක දන්නේ නෑ.' },
        { en: 'Grounding', si: 'Model එකේ උත්තර විශ්වාසදායක sources මත පදනම් කරවීම.' },
        { en: 'RAG (Retrieval-Augmented Generation)', si: 'අදාළ documents හොයලා prompt එකට දාලා උත්තර ලබාගැනීම.' },
      ],
    },

    // 12
    {
      id: 'fine-tuning',
      title: 'Fine-Tuning: Full, PEFT, LoRA, QLoRA, Instruction Tuning',
      body: [
        'Fine-tuning කියන්නේ pretrain කරපු model එකක් ගන්නවා, ඊට පස්සේ ඔයාගේ විශේෂ වැඩකට අදාළ පොඩි data set එකකින් තවදුරටත් train කරන එක. මුල ඉඳන් model එකක් හදනවාට වඩා ගොඩක් ලාභයි, ඉක්මනයි. උදා: සාමාන්‍ය model එකක් ලංකාවේ නීති ලේඛන හෝ ඔයාගේ company එකේ customer support style එකට හුරු කරන එක.',
        'Instruction tuning / SFT (Supervised Fine-Tuning): Base model එකක් assistant කෙනෙක් බවට පත් කරන පළමු පියවර. "උපදෙස → හොඳ උත්තරය" කියන ආකාරයේ, මිනිස්සු ලියපු හෝ තෝරපු උදාහරණ දහස් ගණනකින් train කරනවා. එතකොට model එක text දිගටම ලියනවා වෙනුවට, ප්‍රශ්නයට උත්තර දෙන්න, උපදෙස් පිළිපදින්න ඉගෙන ගන්නවා.',
        'Full fine-tuning: model එකේ හැම parameter එකක්ම update කරනවා. ප්‍රතිඵල හොඳයි, ඒත් විශාල GPU memory, වියදම, සහ හැම වැඩකටම model එකේ සම්පූර්ණ copy එකක් ගබඩා කරන්න ඕනේ. PEFT (Parameter-Efficient Fine-Tuning): මුල් weights freeze කරලා (වෙනස් නොකර), අලුතෙන් එකතු කරපු පොඩි parameters ප්‍රමාණයක් විතරක් train කරනවා. Memory අඩුයි, ලාභයි, ගබඩා කරන්න ඕනේ පොඩි "add-on" file එකක් විතරයි.',
        'PEFT වර්ග: LoRA (Low-Rank Adaptation) = ලොකු weight matrix එකක් වෙනස් කරනවා වෙනුවට, ඒකට එකතු කරන "වෙනස" පොඩි matrices දෙකක ගුණිතයක් ලෙස ඉගෙන ගන්නවා. Train වෙන parameters ප්‍රමාණය මුළු එකෙන් ඉතා කුඩා ප්‍රතිශතයක්. QLoRA = base model එක 4-bit වලට quantize කරලා memory එක ගොඩක් අඩු කරලා, ඒ උඩ LoRA train කරනවා. ලොකු models පවා එක GPU එකක fine-tune කරන්න පුළුවන් වෙන්නේ මේ නිසා. Adapters = Transformer layers අතරට පොඩි අලුත් layers ඇතුළු කරලා ඒවා විතරක් train කරනවා. Prefix tuning = හැම layer එකකම attention එකට trainable "virtual tokens" (prefix vectors) කිහිපයක් ඉස්සරහින් එකතු කරලා ඒවා විතරක් ඉගෙන ගන්නවා.',
      ],
      analogy: 'Pretrained model එක හරියට MBBS ඉවර කරපු දොස්තර කෙනෙක් වගේ. සාමාන්‍ය දැනුම තියෙනවා. Fine-tuning = ඒ දොස්තර specialist training එකකට (උදා: ළමා රෝග) යවනවා. Full fine-tuning = මුළු වෛද්‍ය උපාධියම නැවත කරනවා වගේ, මිලයි. LoRA = තියෙන දැනුම එහෙමම තියාගෙන, පොඩි notebook එකක විශේෂ notes ලියාගන්නවා වගේ. Notebook එක මාරු කරලා වෙනත් specialty එකකටත් යන්න පුළුවන්.',
      example: 'Weight matrix එකක rows 4,096 x columns 4,096 තියෙනවා හිතන්න: parameters 16,777,216ක් (මිලියන 16.7ක් පමණ). LoRA rank 8 එක්ක පොඩි matrices දෙකක්: 4,096 x 8 = 32,768 සහ 8 x 4,096 = 32,768, එකතුව 65,536යි. ඒ කියන්නේ මුල් එකෙන් 0.4%ක් පමණ parameters විතරයි train කරන්නේ. ඒ දෙක ගුණ කළාම 4,096 x 4,096 ප්‍රමාණයේ "වෙනස" matrix එකක් හැදෙනවා, ඒක මුල් weights වලට එකතු කරනවා.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer

# Hugging Face එකෙන් tokenizer එකක් download කරනවා
tok = AutoTokenizer.from_pretrained("bert-base-multilingual-cased")

text = "ශ්‍රී ලංකාව ලස්සන රටක්"
tokens = tok.tokenize(text)   # text එක tokens වලට කඩනවා
print(tokens)                 # tokens බලන්න
print("ගණන:", len(tokens))   # tokens කීයක්ද

# Fine-tune කරන්න කලින් data එකේ tokens ගණන දැනගන්න එක වැදගත්`,
      },
      keyPoints: [
        'Fine-tuning = pretrained model එකක් විශේෂ වැඩකට තවදුරටත් train කිරීම.',
        'SFT / instruction tuning = base model එක උපදෙස් පිළිපදින assistant කෙනෙක් කරනවා.',
        'Full fine-tuning = හැම weight එකම. PEFT = පොඩි අලුත් parameters ටිකක් විතරයි.',
        'LoRA = low-rank matrices දෙකක්. QLoRA = 4-bit base model + LoRA. Adapters, prefix tuning ද PEFT.',
      ],
      terms: [
        { en: 'Fine-Tuning', si: 'Pretrained model එකක් අලුත් data එකකින් තවදුරටත් train කිරීම.' },
        { en: 'Full Fine-Tuning', si: 'Model එකේ සියලුම parameters update කරන fine-tuning.' },
        { en: 'PEFT (Parameter-Efficient Fine-Tuning)', si: 'පොඩි parameters ප්‍රමාණයක් විතරක් train කරන fine-tuning ක්‍රම පවුල.' },
        { en: 'LoRA (Low-Rank Adaptation)', si: 'Weight වෙනස පොඩි matrices දෙකක ගුණිතයක් ලෙස ඉගෙන ගන්න ක්‍රමය.' },
        { en: 'QLoRA', si: '4-bit quantize කළ base model එකක් උඩ LoRA train කරන ක්‍රමය.' },
        { en: 'Adapters', si: 'Layers අතරට ඇතුළු කරන, train කළ හැකි පොඩි modules.' },
        { en: 'Prefix Tuning', si: 'Attention එකට එකතු කරන trainable prefix vectors විතරක් ඉගෙන ගන්න ක්‍රමය.' },
        { en: 'Instruction Tuning', si: 'උපදෙස් සහ උත්තර යුගල වලින් model එක උපදෙස් පිළිපදින්න පුහුණු කිරීම.' },
        { en: 'SFT (Supervised Fine-Tuning)', si: 'හරි උත්තර සහිත labeled උදාහරණ වලින් කරන fine-tuning.' },
        { en: 'Freezing Weights', si: 'Training එකේදී සමහර weights වෙනස් නොවී තියාගැනීම.' },
      ],
    },

    // 13
    {
      id: 'alignment',
      title: 'Alignment: RLHF, Reward Models, PPO, DPO, Constitutional AI',
      body: [
        'SFT එකෙන් පස්සේ model එක උපදෙස් පිළිපදිනවා. ඒත් "හොඳ" උත්තරයක් කියන්නේ මොකක්ද? ප්‍රයෝජනවත්, අවංක, හානිකර නොවන උත්තර දෙන විදිහට model එක මිනිස් වටිනාකම් වලට ගළපන එකට alignment කියනවා. මේකට ප්‍රසිද්ධ ක්‍රමය RLHF (Reinforcement Learning from Human Feedback).',
        'RLHF පියවර: (1) SFT model එකෙන් එකම prompt එකට උත්තර කිහිපයක් ගන්නවා. (2) මිනිස්සු ඒවා සංසන්දනය කරලා "A එක B එකට වඩා හොඳයි" කියලා ranking කරනවා. (3) ඒ preferences වලින් reward model එකක් train කරනවා. ඒකට prompt එකක් සහ උත්තරයක් දුන්නාම "මේක මිනිස්සු කොච්චර කැමති වෙයිද" කියලා score එකක් දෙනවා. (4) PPO (Proximal Policy Optimization) කියන reinforcement learning algorithm එකෙන් LLM එක reward එක වැඩි වෙන උත්තර ලියන්න update කරනවා. ඒත් මුල් model එකෙන් ඕනෑවට වඩා ඈත් නොවෙන්න සීමාවක් (KL penalty) තියනවා, නැත්නම් model එක reward model එක "රවට්ටන" අමුතු උත්තර ලියන්න පටන් ගන්නවා (reward hacking).',
        'DPO (Direct Preference Optimization): RLHF සංකීර්ණයි, අස්ථාවරයි. DPO වෙනම reward model එකක් සහ RL loop එකක් නැතුව, "හොඳ උත්තරය / නරක උත්තරය" යුගල වලින් කෙළින්ම model එක train කරනවා: හොඳ එකේ probability එක වැඩි කරලා, නරක එකේ එක අඩු කරනවා. සරලයි, ස්ථාවරයි, ඒ නිසා ගොඩක් open models වල ජනප්‍රියයි.',
        'Constitutional AI: Anthropic එක හඳුන්වා දුන්න ක්‍රමයක්. මිනිස්සු හැම උත්තරයක්ම label කරනවා වෙනුවට, ලියපු මූලධර්ම ලැයිස්තුවක් ("constitution" එකක්) දෙනවා. Model එක ඒ මූලධර්ම අනුව තමන්ගේම උත්තර විවේචනය කරලා, නැවත ලියනවා. ඊට පස්සේ AI එකම preferences දෙනවා (RLAIF: Reinforcement Learning from AI Feedback). මේකෙන් මිනිස් labeling වැඩ අඩු වෙනවා, නීති පැහැදිලියි, පරීක්ෂා කරන්න පුළුවන්.',
      ],
      analogy: 'RLHF = TV cooking competition එකක් වගේ. Chef (LLM) කෑම වර්ග කිහිපයක් හදනවා. විනිශ්චයකරුවෝ (මිනිස්සු) "මේක අරකට වඩා රසයි" කියලා කියනවා. ඒ මත "රස මනින machine" එකක් (reward model) හදනවා. Chef ඒ machine එකෙන් ලකුණු වැඩි කරගන්න පුහුණු වෙනවා, ඒත් තමන්ගේ මූලික ශෛලිය අමතක නොකර (KL penalty). DPO = machine එකක් නැතුව කෙළින්ම "මේක හොඳයි, ඒක නරකයි" කියන යුගල වලින් ඉගෙන ගන්නවා. Constitutional AI = chef ට රීති පොතක් දීලා "ඔයාගේ කෑම මේ රීති අනුව ඔයාම පරීක්ෂා කරලා හදන්න" කියනවා.',
      example: 'Prompt: "මගේ යාළුවගේ Facebook password එක hack කරන්නේ කොහොමද?" උත්තර A: පියවරෙන් පියවර hacking උපදෙස්. උත්තර B: "ඒක නීති විරෝධී සහ යාළුවාට හානිකරයි. ඔයාගේම account එක access නැත්නම් Facebook recovery ක්‍රම මෙන්න..." Labeler B > A කියලා තෝරනවා. Reward model එක B ට 0.9, A ට 0.1 වගේ score දෙන්න ඉගෙන ගන්නවා. PPO හෝ DPO training එකෙන් පස්සේ model එක B වගේ උත්තර ලියන්න නැඹුරු වෙනවා.',
      keyPoints: [
        'Alignment = model එක ප්‍රයෝජනවත්, අවංක, ආරක්ෂිත කරවීම.',
        'RLHF = මිනිස් rankings → reward model → PPO එකෙන් policy update.',
        'DPO = reward model එකක් නැතුව preference pairs වලින් කෙළින්ම train කිරීම.',
        'Constitutional AI = ලියපු මූලධර්ම අනුව model එකම විවේචනය කරලා AI feedback (RLAIF) පාවිච්චි කිරීම.',
      ],
      terms: [
        { en: 'Alignment', si: 'Model එකේ හැසිරීම මිනිස් අරමුණු සහ වටිනාකම් වලට ගැළපීම.' },
        { en: 'RLHF', si: 'Reinforcement Learning from Human Feedback: මිනිස් preferences වලින් model එක හැඩගැසීම.' },
        { en: 'Reward Model', si: 'උත්තරයක් මිනිස්සු කොච්චර කැමති වෙයිද කියලා score කරන model එක.' },
        { en: 'PPO (Proximal Policy Optimization)', si: 'Policy එක පොඩි, ස්ථාවර පියවර වලින් update කරන RL algorithm එක.' },
        { en: 'KL Penalty', si: 'Model එක මුල් model එකෙන් ඕනෑවට වඩා ඈත් වීම වළක්වන දඬුවම.' },
        { en: 'Reward Hacking', si: 'ඇත්තටම හොඳ නොවී reward model එක රවට්ටලා ලකුණු ගන්න එක.' },
        { en: 'DPO (Direct Preference Optimization)', si: 'Reward model සහ RL නැතුව preference pairs වලින් කෙළින්ම optimize කිරීම.' },
        { en: 'Constitutional AI', si: 'ලියපු මූලධර්ම ලැයිස්තුවක් අනුව model එක ස්වයං-විවේචනය කරන Anthropic ක්‍රමය.' },
        { en: 'RLAIF', si: 'Reinforcement Learning from AI Feedback: මිනිසුන් වෙනුවට AI preferences පාවිච්චි කිරීම.' },
      ],
    },

    // 14
    {
      id: 'efficiency',
      title: 'Efficiency: Distillation, Quantization, Pruning, Mixture of Experts',
      body: [
        'ලොකු LLMs දුවන්න ගොඩක් GPU memory සහ මුදල් ඕනේ. ඒ නිසා models පොඩි කරන්න, වේගවත් කරන්න ක්‍රම කිහිපයක් තියෙනවා. Distillation (knowledge distillation): ලොකු, දක්ෂ "teacher" model එකක outputs (probabilities හෝ උත්තර) පාවිච්චි කරලා පොඩි "student" model එකක් train කරනවා. Student එක teacher ගේ හැසිරීම අනුකරණය කරන්න ඉගෙන ගන්නවා. ප්‍රතිඵලය: ගොඩක් පොඩි, ලාභ model එකක්, ලොකු එකේ දක්ෂතාවයෙන් ලොකු කොටසක් එක්ක.',
        'Quantization: weights ගබඩා කරන අංක වල නිරවද්‍යතාවය අඩු කරනවා. සාමාන්‍යයෙන් weight එකක් bits 16 හෝ 32 කින් තියෙනවා. INT8 = bits 8 integers. INT4 = bits 4. bits 16 සිට 4 ට ගියාම memory එක ආසන්න වශයෙන් 4 ගුණයකින් අඩු වෙනවා, quality එක ටිකක් අඩු වුණත්. GPTQ = layer එකෙන් layer එක, quantize කිරීමෙන් එන දෝෂය අවම වෙන විදිහට ගණිතමය ලෙස weights ගළපන post-training ක්‍රමයක්. AWQ (Activation-aware Weight Quantization) = activations අනුව වඩාත් වැදගත් weights හඳුනාගෙන ඒවා ආරක්ෂා කරමින් quantize කරනවා. GGUF = llama.cpp ecosystem එක පාවිච්චි කරන file format එක. Quantized models laptop එකක CPU / GPU එකේ දුවන්න ගොඩක් ජනප්‍රියයි.',
        'Pruning: වැදගත්කම අඩු weights, neurons, attention heads හෝ layers පවා අයින් කරනවා. Unstructured pruning = තනි weights බිංදුව කරනවා. Structured pruning = සම්පූර්ණ කොටස් අයින් කරනවා, සාමාන්‍ය hardware එකේ වේගය ඇත්තටම වැඩි වෙන්නේ මේකෙන්. Pruning කළාට පස්සේ quality එක ආපහු ගන්න පොඩි retraining එකක් කරන්න සිද්ධ වෙනවා.',
        'Mixture of Experts (MoE): Transformer block එකක එක ලොකු feed-forward network එකක් වෙනුවට, "experts" කියන FFNs ගොඩක් තියෙනවා. Router (gating network) එකක් හැම token එකකටම ගැළපෙනම experts කිහිප දෙනෙක් විතරක් තෝරනවා. ඒ නිසා model එකේ මුළු parameters ගොඩක් තිබුණත්, එක token එකකට ඇත්තටම වැඩ කරන්නේ (active parameters) කුඩා කොටසක් විතරයි. ප්‍රතිඵලය: ලොකු model එකක දැනුම, ඊට වඩා අඩු compute එකකින්. ඒත් හැම expert කෙනෙක්ම memory එකේ තියාගන්න ඕනේ නිසා memory අවශ්‍යතාවය නම් අඩු වෙන්නේ නෑ.',
      ],
      analogy: 'Distillation = විශේෂඥ ගුරුවරයෙක් ගේ tuition notes වලින් ජූනියර් ගුරුවරයෙක් පුහුණු වෙනවා. Quantization = ඡායාරූපයක් 4K වෙනුවට HD වලට compress කරනවා, ඕනෑම කෙනෙකුට තාම හඳුනාගන්න පුළුවන්, file එක පොඩියි. Pruning = ගහක මැරුණු අතු කපනවා. MoE = රෝහලක specialists ලා ගොඩක් ඉන්නවා, ඒත් OPD එකේ ඉන්න nurse (router) ඔයාව යවන්නේ අදාළ දොස්තරලා දෙන්නෙක් ළඟට විතරයි. හැමෝම හැම රෝගියාවම බලන්නේ නෑ.',
      example: 'Parameters බිලියන 8ක model එකක් හිතන්න. 16-bit වලදී weight එකකට bytes 2යි: 8 බිලියන × 2 = GB 16ක් පමණ memory. INT8 වලදී byte 1යි: GB 8ක් පමණ. INT4 වලදී byte 0.5යි: GB 4ක් පමණ. ඒ කියන්නේ සාමාන්‍ය laptop එකකත් දුවන්න පුළුවන් වෙන්න පුළුවන්. (Activations සහ KV cache සඳහා අමතර memory ටිකකුත් ඕනේ.) MoE උදාහරණය: experts 8ක් ඉන්නවා, router එක token එකකට 2ක් තෝරනවා නම්, FFN කොටසේ වැඩ කරන්නේ 2/8 = 25%ක් විතරයි.',
      keyPoints: [
        'Distillation = ලොකු teacher එකෙන් පොඩි student කෙනෙක් ඉගැන්වීම.',
        'Quantization = අංක නිරවද්‍යතාවය අඩු කිරීම (INT8, INT4). GPTQ, AWQ ක්‍රම. GGUF file format එක.',
        'Pruning = වැදගත් නැති weights / කොටස් අයින් කිරීම.',
        'MoE = experts ගොඩක්, token එකකට ටික දෙනයි. Compute අඩුයි, memory නම් තාම ලොකුයි.',
      ],
      terms: [
        { en: 'Knowledge Distillation', si: 'Teacher model එකක outputs වලින් පොඩි student model එකක් train කිරීම.' },
        { en: 'Quantization', si: 'Weights අඩු bits ගණනකින් ගබඩා කරලා memory සහ වේගය දිනාගැනීම.' },
        { en: 'INT8', si: 'Bits 8 integers. 16-bit එකට වඩා memory භාගයක්.' },
        { en: 'INT4', si: 'Bits 4 integers. 16-bit එකට වඩා memory හතරෙන් එකක් පමණ.' },
        { en: 'GGUF', si: 'llama.cpp පාවිච්චි කරන, quantized models ගබඩා කරන file format එක.' },
        { en: 'AWQ', si: 'Activation-aware Weight Quantization: වැදගත් weights ආරක්ෂා කරමින් quantize කිරීම.' },
        { en: 'GPTQ', si: 'Layer එකෙන් layer එක දෝෂය අවම කරමින් කරන post-training quantization ක්‍රමය.' },
        { en: 'Pruning', si: 'අඩු වැදගත්කමක් තියෙන weights හෝ කොටස් ඉවත් කිරීම.' },
        { en: 'Mixture of Experts (MoE)', si: 'Router එකක් token එකකට experts කිහිපයක් විතරක් තෝරන architecture එක.' },
        { en: 'Router / Gating Network', si: 'MoE එකේ හැම token එකක්ම කුමන experts ට යවන්නද කියලා තීරණය කරන කොටස.' },
        { en: 'Active Parameters', si: 'MoE එකක එක token එකක් process කරද්දී ඇත්තටම පාවිච්චි වෙන parameters.' },
      ],
    },

    // 15
    {
      id: 'reasoning-models',
      title: 'Reasoning Models, Chain-of-Thought සහ Test-Time Compute',
      body: [
        'සාමාන්‍ය LLM එකක් ප්‍රශ්නයක් ආපු ගමන් උත්තරය ලියන්න පටන් ගන්නවා. ඒත් අමාරු ගණිත ගැටලුවක්, puzzle එකක්, සංකීර්ණ code bug එකක් වගේ දේකට, කෙළින්ම උත්තරේ කියනවාට වඩා පියවරෙන් පියවර හිතලා බලන එක හොඳයි. Model එක උත්තරයට කලින් අතරමැදි තර්කන පියවර ලියන එකට Chain-of-Thought (CoT) කියනවා. මුලින් මේක සොයාගත්තේ prompt එකේ "පියවරෙන් පියවර හිතන්න" කියලා දාලා.',
        'Reasoning models කියන්නේ මේ හිතීම training එකෙන්ම ප්‍රගුණ කරපු models. Chain-of-thought training කියන්නේ: ගණිත, code වගේ හරි වැරැද්ද පරීක්ෂා කරන්න පුළුවන් ගැටලු දීලා, model එකට දිග තර්කන පෙළක් ලියලා උත්තරයට එන්න දෙනවා. අන්තිම උත්තරේ හරි නම් reward එකක් දෙනවා (reinforcement learning). මේකෙන් model එක තනියම "වැරැද්දක්, ආපහු check කරමු", "වෙන ක්‍රමයකින් බලමු" වගේ හැසිරීම් ඉගෙන ගන්නවා.',
        'Test-time compute කියන්නේ inference වෙලාවේදී (උත්තර දෙන වෙලාවේ) වැඩිපුර ගණනය කිරීම් යොදන එක. ක්‍රම: දිගින් හිතන්න දෙන එක (thinking tokens වැඩියෙන්), උත්තර කිහිපයක් generate කරලා බහුතරය හෝ හොඳම එක තෝරන එක (self-consistency / best-of-N), verifier එකකින් check කරන එක. සොයාගත්ත වැදගත් දෙයක්: model එක ලොකු කරනවා විතරක් නෙවෙයි, හිතන්න වැඩි වෙලාවක් දීමෙනුත් අමාරු ගැටලු වල performance එක වැඩි කරන්න පුළුවන්.',
        'මිල: thinking tokens සාමාන්‍යයෙන් output tokens ලෙස ගණන් වෙනවා. ඒ නිසා reasoning models වැඩි මිලයි, slow. "ලංකාවේ අගනුවර මොකක්ද?" වගේ සරල ප්‍රශ්නයකට reasoning model එකක් ඕනේ නෑ. ඒ වගේම model එක ලියන තර්කනය ඇත්තටම එයා උත්තරයට ආපු විදිහම පෙන්නනවා කියලා සහතික නෑ, ඒක තාම research ප්‍රශ්නයක්.',
      ],
      analogy: 'O/L ගණිත paper එකේ "වැඩ පෙන්වන්න" කියලා තියෙන්නේ ඇයි? පියවර ලිව්වාම වැරදි අඩුයි, ඔයාටම වැරැද්ද අල්ලගන්න පුළුවන්. Chain-of-thought කියන්නේ ඒකමයි. Test-time compute = විභාගෙදී ප්‍රශ්නයකට විනාඩි 1ක් වෙනුවට විනාඩි 10ක් දීලා, කෙටුම්පතක් ලියලා, check කරලා උත්තරේ දෙනවා වගේ.',
      example: 'ප්‍රශ්නය: "Keells එකේ අඹ 1ක් රු. 120යි. අඹ 5ක් ගත්තොත් 10% discount. රු. 1,000 දුන්නොත් ඉතුරු කීයද?" කෙළින්ම උත්තර දෙන model එකක් වැරදි අංකයක් කියන්න පුළුවන්. CoT එක්ක: (1) 5 × 120 = 600. (2) 10% discount = 60. (3) ගෙවන්න ඕනේ 600 − 60 = 540. (4) ඉතුරු = 1,000 − 540 = රු. 460. Self-consistency: model එකෙන් උත්තර 5ක් ගත්තාම 460, 460, 460, 400, 460 ආවොත්, බහුතරය 460 තෝරනවා.',
      keyPoints: [
        'Chain-of-thought = උත්තරයට කලින් අතරමැදි තර්කන පියවර ලිවීම.',
        'Reasoning models = RL එකෙන් දිග තර්කනය කරන්න පුහුණු කළ models.',
        'Test-time compute = උත්තර දෙන වෙලාවේ වැඩිපුර හිතන්න / සාම්පල ගන්න compute දීම.',
        'අමාරු ගැටලු වලට හොඳයි. ඒත් වැඩි tokens, වැඩි මිල, වැඩි වෙලාව.',
      ],
      terms: [
        { en: 'Chain-of-Thought (CoT)', si: 'උත්තරයට කලින් පියවරෙන් පියවර තර්කනය ලිවීම.' },
        { en: 'Chain-of-Thought Training', si: 'දිග තර්කන පෙළවල් ලියලා හරි උත්තරයට එන්න model එක පුහුණු කිරීම, බොහෝ විට RL එක්ක.' },
        { en: 'Reasoning Models', si: 'උත්තර දෙන්න කලින් දිගින් "හිතන්න" පුහුණු කරපු LLMs.' },
        { en: 'Test-Time Compute', si: 'Inference වෙලාවේ වැඩිපුර ගණනය කිරීම් යොදා performance වැඩි කිරීම.' },
        { en: 'Thinking Tokens', si: 'අවසාන උත්තරයට කලින් model එක ලියන තර්කන tokens.' },
        { en: 'Self-Consistency / Best-of-N', si: 'උත්තර කිහිපයක් generate කරලා බහුතරය හෝ හොඳම එක තෝරන ක්‍රමය.' },
        { en: 'Verifier', si: 'උත්තරයක් හරිද කියලා පරීක්ෂා කරන program එකක් හෝ model එකක්.' },
      ],
    },

    // 16
    {
      id: 'open-vs-closed',
      title: 'Open vs Closed Models',
      body: [
        'Closed models (proprietary models): GPT models, Claude, Gemini වගේ ඒවා. Weights public නෑ. පාවිච්චි කරන්නේ company එකේ API එක හෝ app එක හරහා විතරයි. වාසි: සාමාන්‍යයෙන් ඉහළම දක්ෂතාවය, servers ගැන හිතන්න ඕනේ නෑ, safety සහ updates company එක බලාගන්නවා. අවාසි: tokens අනුව නිතර ගෙවන්න වෙනවා, ඔයාගේ data එක වෙනත් company එකක servers වලට යනවා, model එක වෙනස් කරන්න හෝ ඇතුළ බලන්න බෑ, company එක model එක වෙනස් කළොත් හෝ නැවැත්තුවොත් ඔයාට පාලනයක් නෑ.',
        'Open-weight models: Llama, Mistral, Qwen, Gemma, DeepSeek වගේ ඒවා. Weights download කරලා ඔයාගේම computer එකේ හෝ server එකේ දුවන්න පුළුවන්. වාසි: data ඔයා ළඟම තියෙනවා (privacy), fine-tune කරන්න පුළුවන් (LoRA ආදිය), quantize කරලා (GGUF ආදිය) laptop එකේ offline දුවන්න පුළුවන්, ලොකු ප්‍රමාණයෙන් පාවිච්චි කරද්දී ලාභ වෙන්න පුළුවන්. අවාසි: GPU / hardware ඔයාටම ඕනේ, setup, maintenance, safety ඔයාගේ වගකීම.',
        'වැදගත් වෙනසක්: "open-weight" සහ ඇත්ත "open source" එකයි නෙවෙයි. ගොඩක් models දෙන්නේ weights විතරයි, training data සහ සම්පූර්ණ training code එක නෙවෙයි. සමහර models වල license එකේ වාණිජ භාවිතයට සීමාවන් තියෙනවා. ඒ නිසා project එකකට ගන්න කලින් license එක කියවන්නම ඕනේ.',
        'කුමක් තෝරන්නද? ඉක්මනට prototype එකක් හදනවා නම්, ඉහළම quality එක ඕනේ නම් closed API එකක් හොඳ ආරම්භයක්. රෝහල් හෝ බැංකු data වගේ sensitive data, offline අවශ්‍යතා, විශේෂ fine-tuning, හෝ විශාල පරිමාණයෙන් වියදම පාලනය කරන්න ඕනේ නම් open-weight model එකක් සලකා බලන්න. ගොඩක් companies දෙකම එකට පාවිච්චි කරනවා.',
      ],
      analogy: 'Closed model = Uber / PickMe ride එකක් වගේ. Call කළාම එනවා, driver, වාහනය, නඩත්තුව ඔක්කොම ඔවුන්ගේ. ඔයා ගමනකට ගෙවනවා, ඒත් route එක හෝ වාහනය වෙනස් කරන්න බෑ. Open-weight model = ඔයාගේම tuk-tuk එකක් ගන්නවා වගේ. ඔයාට ඕනේ විදිහට modify කරන්න පුළුවන්, ඕනෑම වෙලාවක යන්න පුළුවන්, ඒත් fuel, service, repairs ඔයාගේ වගකීම.',
      example: 'කොළඹ startup එකක් සිංහල customer support bot එකක් හදනවා. පළමු මාසේ closed API එකක් එක්ක prototype එක සති 2කින් හදනවා. Users ලක්ෂ ගණනක් එනකොට token බිල්පත ලොකු වෙනවා, ඒ වගේම customer data රට ඇතුළේ තියාගන්න නීතිමය අවශ්‍යතාවයක් එනවා. ඒ නිසා ඔවුන් open-weight model එකක් තමන්ගේ server එකේ දාලා, සිංහල support conversations වලින් LoRA fine-tune කරලා, INT4 quantize කරලා දුවනවා. අමාරුම ප්‍රශ්න විතරක් closed model එකට යවනවා.',
      keyPoints: [
        'Closed = API එකෙන් විතරයි, weights නෑ. පහසුයි, බොහෝ විට ඉහළම quality.',
        'Open-weight = weights download කරලා ඔයාම දුවන්න, fine-tune කරන්න පුළුවන්.',
        'Open-weight ≠ සම්පූර්ණ open source. License එක පරීක්ෂා කරන්න.',
        'Privacy, වියදම, පාලනය, quality අතර trade-off එක බලලා තෝරන්න.',
      ],
      terms: [
        { en: 'Closed / Proprietary Model', si: 'Weights public නොකර API එකක් හරහා විතරක් දෙන model.' },
        { en: 'Open-Weight Model', si: 'Weights download කරලා ඕනෑම තැනක දුවන්න පුළුවන් model.' },
        { en: 'Open Source Model', si: 'Weights පමණක් නොව code, සමහර විට data ද විවෘත කරපු, නිදහස් license එකක් තියෙන model.' },
        { en: 'License', si: 'Model එක කොහොම පාවිච්චි කරන්න පුළුවන්ද කියන නීතිමය කොන්දේසි.' },
        { en: 'Self-Hosting', si: 'Model එක ඔයාගේම server / computer එකේ දුවන එක.' },
        { en: 'API', si: 'වෙනත් company එකක model එකට program එකකින් request යවන ක්‍රමය.' },
      ],
    },
  ],

  quiz: [
    {
      q: 'Self-attention එකේ Query, Key, Value හොඳින්ම විස්තර කරන්නේ කුමන පුස්තකාල උපමාවද?',
      options: [
        'Query = පොතේ අන්තර්ගතය, Key = ඔයාගේ ඉල්ලීම, Value = පොතේ label එක',
        'Query = ඔයාගේ ඉල්ලීම, Key = පොතේ පිටේ label එක, Value = පොතේ අන්තර්ගතය',
        'Query, Key, Value තුනම එකම දේ, නම් විතරක් වෙනස්',
      ],
      answer: 1,
      why: 'Query කියන්නේ token එක හොයන දේ. ඒක අනිත් tokens වල Keys (labels) එක්ක ගළපනවා. ගැළපෙන තරමට ඒ tokens වල Values (ඇත්ත තොරතුරු) ගන්නවා.',
    },
    {
      q: 'GPT, Claude වගේ decoder-only models වල causal masking අවශ්‍ය ඇයි?',
      options: [
        'Model එකට token එකකට පස්සෙන් එන tokens බලන්න නොදී, ඇත්තටම ඊළඟ token එක අනුමාන කරන්න පුරුදු කරන්න',
        'Model එකේ parameters ගණන අඩු කරන්න',
        'සිංහල text වලට tokens අඩුවෙන් යන්න',
      ],
      answer: 0,
      why: 'Training එකේදී අනාගත tokens පේනවා නම් model එක "answer sheet" එක බලනවා වගේ. Causal mask එක තමන්ට කලින් tokens විතරක් බලන්න දෙනවා.',
    },
    {
      q: 'BPE tokenizer එකක් train කරද්දී හැම පියවරකම කරන්නේ මොකක්ද?',
      options: [
        'හැම වචනයක්ම අකුරු වලට කඩලා අහඹු ලෙස එකතු කරනවා',
        'Dictionary එකක තියෙන වචන විතරක් tokens කරනවා',
        'Training text එකේ නිතරම එකට එන tokens යුගලය හොයලා ඒක අලුත් token එකක් ලෙස merge කරනවා',
      ],
      answer: 2,
      why: 'BPE අකුරු වලින් පටන් අරන්, වැඩියෙන්ම එකට එන යුගලය නැවත නැවත merge කරනවා, vocabulary එක ඕනේ ප්‍රමාණයට එනකන්.',
    },
    {
      q: 'එකම අදහස සිංහලෙන් ලිව්වාම බොහෝ විට ඉංග්‍රීසියට වඩා tokens වැඩියෙන් යන්නේ ඇයි?',
      options: [
        'සිංහල වචන දිග නිසා model එකට තේරෙන්නේ නැති නිසා',
        'Tokenizers ගොඩක් ඉංග්‍රීසි ප්‍රමුඛ data වලින් train කරලා සිංහල merges අඩු නිසා සහ UTF-8 වල සිංහල අකුරකට bytes 3ක් යන නිසා',
        'API companies සිංහලට වැඩිපුර ගාස්තු නියම කරලා තියෙන නිසා',
      ],
      answer: 1,
      why: 'සිංහල training data අඩු නිසා සිංහල වචන tokens බවට merge වෙලා නෑ. Byte-level tokenizers වලදී සිංහල අකුරක් bytes 3ක් නිසා තවත් tokens වැඩි වෙනවා.',
    },
    {
      q: 'Temperature එක ගොඩක් අඩු කළොත් (උදා: 0.1) model එකේ output එකට මොකද වෙන්නේ?',
      options: [
        'ඉහළම probability එක තියෙන token එක තවත් ප්‍රබල වෙලා, උත්තර ස්ථාවර සහ පුරෝකථනය කළ හැකි වෙනවා',
        'දුර්ලභ tokens වැඩියෙන් තෝරලා උත්තර නිර්මාණශීලී වෙනවා',
        'Model එකේ context window එක දිග වෙනවා',
      ],
      answer: 0,
      why: 'Logits අඩු temperature එකකින් බෙදුවාම වෙනස්කම් විශාල වෙනවා. Softmax එකෙන් පස්සේ ඉහළම token එකට probability එකෙන් ගොඩක් යනවා, ප්‍රායෝගිකව greedy වගේ.',
    },
    {
      q: 'Inference වලදී KV cache එකේ ප්‍රධාන වාසිය මොකක්ද?',
      options: [
        'Model එකේ weights update කරලා ඉක්මනට ඉගෙන ගන්න දෙනවා',
        'Hallucinations සම්පූර්ණයෙන්ම නැති කරනවා',
        'කලින් tokens වල Keys සහ Values ගබඩා කරලා, හැම අලුත් token එකකටම ඒවා නැවත ගණනය කරන එක වළක්වනවා',
      ],
      answer: 2,
      why: 'KV cache එකෙන් generation එක වේගවත් වෙනවා. ඒත් context එක දිග වෙද්දී memory වැඩියෙන් යනවා.',
    },
    {
      q: 'LoRA ගැන හරිම ප්‍රකාශය කුමක්ද?',
      options: [
        'Model එකේ හැම weight එකක්ම update කරන full fine-tuning ක්‍රමයක්',
        'මුල් weights freeze කරලා, weight වෙනස පොඩි low-rank matrices දෙකක ගුණිතයක් ලෙස ඉගෙන ගන්න PEFT ක්‍රමයක්',
        'Model එක 4-bit වලට quantize කරන file format එකක්',
      ],
      answer: 1,
      why: 'LoRA එකේ train වෙන්නේ ඉතා පොඩි parameters ප්‍රමාණයක් විතරයි. 4-bit quantization එකත් එක්ක කළාම ඒක QLoRA. GGUF තමයි file format එක.',
    },
    {
      q: 'RLHF සහ DPO අතර ප්‍රධාන වෙනස මොකක්ද?',
      options: [
        'RLHF වෙනම reward model එකක් සහ PPO වගේ RL ක්‍රමයක් පාවිච්චි කරනවා. DPO preference pairs වලින් කෙළින්ම model එක optimize කරනවා',
        'DPO මිනිස් preferences කිසිසේත්ම පාවිච්චි කරන්නේ නෑ',
        'RLHF pretraining එකේදී විතරක් කරන දෙයක්, DPO inference එකේදී කරන දෙයක්',
      ],
      answer: 0,
      why: 'දෙකම "හොඳ / නරක" preference data පාවිච්චි කරනවා. DPO reward model එක සහ RL loop එක මඟහැරලා සරල, ස්ථාවර training එකක් දෙනවා.',
    },
  ],
}
