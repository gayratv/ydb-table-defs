https://github.com/google/re2.wiki.git

Регулярные выражения - это обозначения для описания наборов символьных строк. Когда конкретная строка входит в набор, описываемый регулярным выражением, мы часто говорим, что регулярное выражение соответствует строке.

Самое простое регулярное выражение - это один буквальный символ. За исключением таких метасимволов, как *+?()|, символы соответствуют друг другу. Чтобы сопоставить метасимвол, экранируйте его обратной косой чертой: \+ соответствует буквальному символу плюса.

Два регулярных выражения можно чередовать или объединять, чтобы сформировать новое регулярное выражение: если e 1 соответствует s, а e 2 соответствует t , то e 1 |e 2 соответствует s или t , а e 1 e 2 соответствует st .

Метасимволы *, +и ? являются операторами повторения: e 1* соответствует последовательности из нуля или более (возможно, разных) строк, каждая из которых соответствует e 1 ; e 1+ соответствует одному или нескольким; e 1? соответствует нулю или единице.

Приоритет операторов, от самого слабого до самого сильного связывания, - это сначала чередование, затем конкатенация и, наконец, операторы повторения. Явные круглые скобки могут использоваться для обозначения разных значений, как и в арифметических выражениях. Некоторые примеры: ab|cd эквивалентно (ab)|(cd); ab* эквивалентно a(b*).

Синтаксис, описанный до сих пор, является большей частью традиционного синтаксиса регулярных выражений egrep Unix . Этого подмножества достаточно для описания всех обычных языков: грубо говоря, обычный язык - это набор строк, которые могут быть сопоставлены за один проход по тексту, используя только фиксированный объем памяти. Новые средства регулярных выражений (особенно Perl и те, которые его скопировали) добавили много новых операторов и управляющих последовательностей, которые делают регулярные выражения более краткими, а иногда и более загадочными, но обычно не более мощными.




|виды односимвольных выражений|Примеры|
|---|---|
|любой символ, возможно, включая новую строку  (s=true)|.|
|класс символов|[xyz]|
|все символы кроме указанных символов|[^xyz]|
|класс символов Perl <a href="#perl">(link)</a>|\d|
|все символы за исключением символов класса Perl|\D|
|ASCII character class <a href="#ascii">(link)</a>|[[:alpha:]|
|все символы за исключением  ASCII character class|[[:^alpha:]|
|набор символов Unicode (однобуквенные обозначения)|\pN|
|набор символов Unicode |\p{Greek}<|
|все символы за исключением однобуквенных классов Unicode |\PN|
|все символы за исключением  классов Unicode|\P{Greek}|




| | Композиция выражений |
|---|--------------|
|xy|x с последующим y|
|x\|y|`x`или `y`(предпочтительно `x`)|

| | Повторы|
|---|--------------|
|x*|ноль или больше  x, предпочтительно больше|
|x+|один или больше  x, предпочтительно больше|
|x?|ноль или один x, предпочтительно один|
|x{n,m}|повторять x от n до m раз, предпочтительно больше, m > n|
|x{n,}|повторять x от n до бесконечности раз, предпочтительно больше|
|x{n}|повторять x точно n раз|
|x*?|ноль или больше x, предпочтительно меньше|
|x+?|один или больше  x, предпочтительно меньше|
|x??|ноль или один x, предпочтительно ноль|
|x{n,m}?|повторять x от n до m раз, предпочтительно меньше|
|x{n,}?|повторять x от n до бесконечности раз, предпочтительно меньше|
|x{n}?|повторять x точно n раз|

Ограничение реализации: Формы подсчета x{n,m}, x{n,}, и x{n} не позволяют задавать значения больше 1000. Неограниченные повторы с помощью символов * и + не ограничиваются.

| | Группировка |
|---|-----------|
|<code>(re)</code>|пронумерованная группа захвата|
|<code>(?P&lt;name&gt;re)</code>|именованная группа захвата<br />при выводе Вы можете обращаться к ней через name<br />Пример|
|<code>(?:re)</code>|non-capturing group|
|<code>(?flags)</code>|set flags within current group; non-capturing|
|<code>(?flags:re)</code>|set flags during re; non-capturing|
|<font color='#808080'><code>(?#text)</code></font>|comment <small>(NOT SUPPORTED)</small>|

**Пример:**

```
$value = "Вася ел та-та  банан и сосал сушку"u;
$capture = Re2::Capture(@@.*(?P<foo>ба\pL* )@@);

SELECT
  $capture($value) AS capture,
  $capture($value).foo AS capture_member,
  $capture($value)._0 AS member0
```
Результат:

![Вывод](..\..\assets\re2-ex1.png)



| | Флаги|
|---|-----------|
|<code>i</code>|без учета регистра (по умолчанию false)|
|<code>m</code>|многострочный режим: `^`и `$`соответствие начальной / конечной строке в дополнение к начальному / конечному тексту (по умолчанию false)|
|<code>s</code>|разрешить `.`совпадать с `\n`(по умолчанию false)|
|<code>U</code>|ungreedy: поменять местами значения `x*`и `x*?`, `x+`и и `x+?`т. д. (по умолчанию false)|

<p>Flag syntax is <code>xyz</code> (set) or <code>-xyz</code> (clear) or <code>xy-z</code> (set <code>xy</code>, clear <code>z</code>).


| | Пустые строки |
|---|-----------|
|<code>^</code>|в начале текста или строки ( `m`= true)|
|<code>$</code>|конце текста (например, `\z`нет `\Z`) или строки ( `m`= истина)|
|<code>\A</code>|в начале текста|
|<code>\b</code>|на ASCII границе слова ( `\w`с одной стороны , и `\W`, `\A`или `\z`с другой стороны )|
|<code>\B</code>|не на границе слова ASCII|
|<code>\z</code>|at end of text|

| | Элементы класса                                          |
|---|----------------------------------------------------------|
|<code>x</code>| одиночный символ                                              |
|<code>A-Z</code>| диапазон символов (включительно)                             |
|<code>\d</code>| Класс символов Perl                  |
|<code>[:foo:]</code>| Класс символов ASCII `foo` |
|<code>\p{Foo}</code>| Класс символов Unicode `Foo` |
|<code>\pF</code>| Класс символов Unicode `F`(однобуквенное имя) |

| | Именованные классы символов |
|---|----------------------------------------------------------|
|<code>[\d]</code>|цифры (≡ `\d`)|
|```[^\d]```|не цифры (≡ `\D`)|
|<code>[\D]</code>|не цифры (≡ `\D`)|
|<code>[^\D]</code>|не цифры (≡ `\D`)|
|<code>[[:name:]]</code>|именованный класс ASCII  (≡ <code>[:name:]</code>)|
|<code>[^[:name:]]</code>|named ASCII class inside negated character class (≡ <code>[:^name:]</code>)|
|<code>[\p{Name}]</code>|named Unicode property inside character class (≡ <code>\p{Name}</code>)|
|<code>[^\p{Name}]</code>|named Unicode property inside negated character class (≡ <code>\P{Name}</code>)|

<a name="perl"></a>
<table>
| | Perl character classes (all ASCII-only)|
|<code>\d</code>|digits (≡ <code>[0-9]</code>)|
|<code>\D</code>|not digits (≡ <code>[^0-9]</code>)|
|<code>\s</code>|whitespace (≡ <code>[\t\n\f\r ]</code>)|
|<code>\S</code>|not whitespace (≡ <code>[^\t\n\f\r ]</code>)|
|<code>\w</code>|word characters (≡ <code>[0-9A-Za-z_]</code>)|
|<code>\W</code>|not word characters (≡ <code>[^0-9A-Za-z_]</code>)|
|<font color='#808080'><code>\h</code></font>|horizontal space <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>\H</code></font>|not horizontal space <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>\v</code></font>|vertical space <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>\V</code></font>|not vertical space <small>(NOT SUPPORTED)</small>|
</table>

<a name="ascii"></a>
<table>
| | ASCII character classes|
|<code>[[:alnum:]]</code>|alphanumeric (≡ <code>[0-9A-Za-z]</code>)|
|<code>[[:alpha:]]</code>|alphabetic (≡ <code>[A-Za-z]</code>)|
|<code>[[:ascii:]]</code>|ASCII (≡ <code>[\x00-\x7F]</code>)|
|<code>[[:blank:]]</code>|blank (≡ <code>[\t ]</code>)|
|<code>[[:cntrl:]]</code>|control (≡ <code>[\x00-\x1F\x7F]</code>)|
|<code>[[:digit:]]</code>|digits (≡ <code>[0-9]</code>)|
|<code>[[:graph:]]</code>|graphical (≡ <code>[!-~]</code> ≡ <code>[A-Za-z0-9!"#$%&amp;'()*+,\-./:;&lt;=&gt;?@[\\\]^_</code><code>`</code><code>{|}~]</code>)|
|<code>[[:lower:]]</code>|lower case (≡ <code>[a-z]</code>)|
|<code>[[:print:]]</code>|printable (≡ <code>[ -~]</code> ≡ <code>[ [:graph:]]</code>)|
|<code>[[:punct:]]</code>|punctuation (≡ <code>[!-/:-@[-</code><code>`</code><code>{-~]</code>)|
|<code>[[:space:]]</code>|whitespace (≡ <code>[\t\n\v\f\r ]</code>)|
|<code>[[:upper:]]</code>|upper case (≡ <code>[A-Z]</code>)|
|<code>[[:word:]]</code>|word characters (≡ <code>[0-9A-Za-z_]</code>)|
|<code>[[:xdigit:]]</code>|hex digit (≡ <code>[0-9A-Fa-f]</code>)|
</table>

<table>
| | Unicode character class names--general category|
|<code>C</code>|other|
|<code>Cc</code>|control|
|<code>Cf</code>|format|
|<font color='#808080'><code>Cn</code></font>|unassigned code points <small>(NOT SUPPORTED)</small>|
|<code>Co</code>|private use|
|<code>Cs</code>|surrogate|
|<code>L</code>|letter|
|<font color='#808080'><code>LC</code></font>|cased letter <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>L&amp;</code></font>|cased letter <small>(NOT SUPPORTED)</small>|
|<code>Ll</code>|lowercase letter|
|<code>Lm</code>|modifier letter|
|<code>Lo</code>|other letter|
|<code>Lt</code>|titlecase letter|
|<code>Lu</code>|uppercase letter|
|<code>M</code>|mark|
|<code>Mc</code>|spacing mark|
|<code>Me</code>|enclosing mark|
|<code>Mn</code>|non-spacing mark|
|<code>N</code>|number|
|<code>Nd</code>|decimal number|
|<code>Nl</code>|letter number|
|<code>No</code>|other number|
|<code>P</code>|punctuation|
|<code>Pc</code>|connector punctuation|
|<code>Pd</code>|dash punctuation|
|<code>Pe</code>|close punctuation|
|<code>Pf</code>|final punctuation|
|<code>Pi</code>|initial punctuation|
|<code>Po</code>|other punctuation|
|<code>Ps</code>|open punctuation|
|<code>S</code>|symbol|
|<code>Sc</code>|currency symbol|
|<code>Sk</code>|modifier symbol|
|<code>Sm</code>|math symbol|
|<code>So</code>|other symbol|
|<code>Z</code>|separator|
|<code>Zl</code>|line separator|
|<code>Zp</code>|paragraph separator|
|<code>Zs</code>|space separator|
</table>

<table>
<tr><th>Unicode character class names--scripts|
|<code>Adlam</code>|
|<code>Ahom</code>|
|<code>Anatolian_Hieroglyphs</code>|
|<code>Arabic</code>|
|<code>Armenian</code>|
|<code>Avestan</code>|
|<code>Balinese</code>|
|<code>Bamum</code>|
|<code>Bassa_Vah</code>|
|<code>Batak</code>|
|<code>Bengali</code>|
|<code>Bhaiksuki</code>|
|<code>Bopomofo</code>|
|<code>Brahmi</code>|
|<code>Braille</code>|
|<code>Buginese</code>|
|<code>Buhid</code>|
|<code>Canadian_Aboriginal</code>|
|<code>Carian</code>|
|<code>Caucasian_Albanian</code>|
|<code>Chakma</code>|
|<code>Cham</code>|
|<code>Cherokee</code>|
|<code>Chorasmian</code>|
|<code>Common</code>|
|<code>Coptic</code>|
|<code>Cuneiform</code>|
|<code>Cypriot</code>|
|<code>Cypro_Minoan</code>|
|<code>Cyrillic</code>|
|<code>Deseret</code>|
|<code>Devanagari</code>|
|<code>Dives_Akuru</code>|
|<code>Dogra</code>|
|<code>Duployan</code>|
|<code>Egyptian_Hieroglyphs</code>|
|<code>Elbasan</code>|
|<code>Elymaic</code>|
|<code>Ethiopic</code>|
|<code>Georgian</code>|
|<code>Glagolitic</code>|
|<code>Gothic</code>|
|<code>Grantha</code>|
|<code>Greek</code>|
|<code>Gujarati</code>|
|<code>Gunjala_Gondi</code>|
|<code>Gurmukhi</code>|
|<code>Han</code>|
|<code>Hangul</code>|
|<code>Hanifi_Rohingya</code>|
|<code>Hanunoo</code>|
|<code>Hatran</code>|
|<code>Hebrew</code>|
|<code>Hiragana</code>|
|<code>Imperial_Aramaic</code>|
|<code>Inherited</code>|
|<code>Inscriptional_Pahlavi</code>|
|<code>Inscriptional_Parthian</code>|
|<code>Javanese</code>|
|<code>Kaithi</code>|
|<code>Kannada</code>|
|<code>Katakana</code>|
|<code>Kayah_Li</code>|
|<code>Kharoshthi</code>|
|<code>Khitan_Small_Script</code>|
|<code>Khmer</code>|
|<code>Khojki</code>|
|<code>Khudawadi</code>|
|<code>Lao</code>|
|<code>Latin</code>|
|<code>Lepcha</code>|
|<code>Limbu</code>|
|<code>Linear_A</code>|
|<code>Linear_B</code>|
|<code>Lisu</code>|
|<code>Lycian</code>|
|<code>Lydian</code>|
|<code>Mahajani</code>|
|<code>Makasar</code>|
|<code>Malayalam</code>|
|<code>Mandaic</code>|
|<code>Manichaean</code>|
|<code>Marchen</code>|
|<code>Masaram_Gondi</code>|
|<code>Medefaidrin</code>|
|<code>Meetei_Mayek</code>|
|<code>Mende_Kikakui</code>|
|<code>Meroitic_Cursive</code>|
|<code>Meroitic_Hieroglyphs</code>|
|<code>Miao</code>|
|<code>Modi</code>|
|<code>Mongolian</code>|
|<code>Mro</code>|
|<code>Multani</code>|
|<code>Myanmar</code>|
|<code>Nabataean</code>|
|<code>Nandinagari</code>|
|<code>New_Tai_Lue</code>|
|<code>Newa</code>|
|<code>Nko</code>|
|<code>Nushu</code>|
|<code>Nyiakeng_Puachue_Hmong</code>|
|<code>Ogham</code>|
|<code>Ol_Chiki</code>|
|<code>Old_Hungarian</code>|
|<code>Old_Italic</code>|
|<code>Old_North_Arabian</code>|
|<code>Old_Permic</code>|
|<code>Old_Persian</code>|
|<code>Old_Sogdian</code>|
|<code>Old_South_Arabian</code>|
|<code>Old_Turkic</code>|
|<code>Old_Uyghur</code>|
|<code>Oriya</code>|
|<code>Osage</code>|
|<code>Osmanya</code>|
|<code>Pahawh_Hmong</code>|
|<code>Palmyrene</code>|
|<code>Pau_Cin_Hau</code>|
|<code>Phags_Pa</code>|
|<code>Phoenician</code>|
|<code>Psalter_Pahlavi</code>|
|<code>Rejang</code>|
|<code>Runic</code>|
|<code>Samaritan</code>|
|<code>Saurashtra</code>|
|<code>Sharada</code>|
|<code>Shavian</code>|
|<code>Siddham</code>|
|<code>SignWriting</code>|
|<code>Sinhala</code>|
|<code>Sogdian</code>|
|<code>Sora_Sompeng</code>|
|<code>Soyombo</code>|
|<code>Sundanese</code>|
|<code>Syloti_Nagri</code>|
|<code>Syriac</code>|
|<code>Tagalog</code>|
|<code>Tagbanwa</code>|
|<code>Tai_Le</code>|
|<code>Tai_Tham</code>|
|<code>Tai_Viet</code>|
|<code>Takri</code>|
|<code>Tamil</code>|
|<code>Tangsa</code>|
|<code>Tangut</code>|
|<code>Telugu</code>|
|<code>Thaana</code>|
|<code>Thai</code>|
|<code>Tibetan</code>|
|<code>Tifinagh</code>|
|<code>Tirhuta</code>|
|<code>Toto</code>|
|<code>Ugaritic</code>|
|<code>Vai</code>|
|<code>Vithkuqi</code>|
|<code>Wancho</code>|
|<code>Warang_Citi</code>|
|<code>Yezidi</code>|
|<code>Yi</code>|
|<code>Zanabazar_Square</code>|
</table>

<table>
| | Vim character classes|
|<font color='#808080'><code>\i</code></font>|identifier character <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\I</code></font>|<code>\i</code> except digits <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\k</code></font>|keyword character <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\K</code></font>|<code>\k</code> except digits <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\f</code></font>|file name character <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\F</code></font>|<code>\f</code> except digits <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\p</code></font>|printable character <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\P</code></font>|<code>\p</code> except digits <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\s</code></font>|whitespace character (≡ <code>[ \t]</code>) <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\S</code></font>|non-white space character (≡ <code>[^ \t]</code>) <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<code>\d</code>|digits (≡ <code>[0-9]</code>) <small>VIM</small>|
|<code>\D</code>|not <code>\d</code> <small>VIM</small>|
|<font color='#808080'><code>\x</code></font>|hex digits (≡ <code>[0-9A-Fa-f]</code>) <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\X</code></font>|not <code>\x</code> <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\o</code></font>|octal digits (≡ <code>[0-7]</code>) <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\O</code></font>|not <code>\o</code> <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<code>\w</code>|word character <small>VIM</small>|
|<code>\W</code>|not <code>\w</code> <small>VIM</small>|
|<font color='#808080'><code>\h</code></font>|head of word character <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\H</code></font>|not <code>\h</code> <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\a</code></font>|alphabetic <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\A</code></font>|not <code>\a</code> <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\l</code></font>|lowercase <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\L</code></font>|not lowercase <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\u</code></font>|uppercase <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\U</code></font>|not uppercase <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\_x</code></font>|<code>\x</code> plus newline, for any <code>x</code> <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\c</code></font>|ignore case <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\C</code></font>|match case <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\m</code></font>|magic <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\M</code></font>|nomagic <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\v</code></font>|verymagic <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\V</code></font>|verynomagic <small>(NOT SUPPORTED)</small> <small>VIM</small>|
|<font color='#808080'><code>\Z</code></font>|ignore differences in Unicode combining characters <small>(NOT SUPPORTED)</small> <small>VIM</small>|
</table>

<table>
| | Magic|
|<font color='#808080'><code>(?{code})</code></font>|arbitrary Perl code <small>(NOT SUPPORTED)</small> <small>PERL</small>|
|<font color='#808080'><code>(??{code})</code></font>|postponed arbitrary Perl code <small>(NOT SUPPORTED)</small> <small>PERL</small>|
|<font color='#808080'><code>(?n)</code></font>|recursive call to regexp capturing group <code>n</code> <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?+n)</code></font>|recursive call to relative group <code>+n</code> <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?-n)</code></font>|recursive call to relative group <code>-n</code> <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?C)</code></font>|PCRE callout <small>(NOT SUPPORTED)</small> <small>PCRE</small>|
|<font color='#808080'><code>(?R)</code></font>|recursive call to entire regexp (≡ <code>(?0)</code>) <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?&amp;name)</code></font>|recursive call to named group <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?P=name)</code></font>|named backreference <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?P&gt;name)</code></font>|recursive call to named group <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?(cond)true|false)</code></font>|conditional branch <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(?(cond)true)</code></font>|conditional branch <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*ACCEPT)</code></font>|make regexps more like Prolog <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*COMMIT)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*F)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*FAIL)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*MARK)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*PRUNE)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*SKIP)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*THEN)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*ANY)</code></font>|set newline convention <small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*ANYCRLF)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*CR)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*CRLF)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*LF)</code></font>|<small>(NOT SUPPORTED)</small>|
|<font color='#808080'><code>(*BSR_ANYCRLF)</code></font>|set \R convention <small>(NOT SUPPORTED)</small> <small>PCRE</small>|
|<font color='#808080'><code>(*BSR_UNICODE)</code></font>|<small>(NOT SUPPORTED)</small> <small>PCRE</small>|
</table>
