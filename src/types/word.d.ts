type WordType = string
type KanjiType = string
type GrammarType = string
type VerbType = string

type JLPTDataType = "noun" | "particle"

interface KanjiBaseInterface {
  main: KanjiType
  kunyomi: string
  onyomi: string
  romaji: string
  meaning: string
}
type KanjiBaseKeyOf = keyof KanjiBaseInterface

interface JLPTBaseInterface {
  main: WordType | KanjiType | GrammarType | VerbType
  kana: string
  romaji: string
  meaning: string
}

interface JLPTN5BaseInterface extends JLPTBaseInterface { }
interface JLPTN5KanjiBaseInterface extends KanjiBaseInterface { }

interface JLPTN5NounInterface extends JLPTN5BaseInterface { }
interface JLPTN5ParticlesInterface extends Pick<JLPTN5BaseInterface, "main" | "romaji" | "meaning"> { }
interface JLPTN5KatakanaNounInterface extends Pick<JLPTN5BaseInterface, "main" | "romaji" | "meaning"> { }
interface JLPTN5AdverbInterface extends JLPTN5BaseInterface { }
interface JLPTN5AdjectiveIInterface extends JLPTN5BaseInterface { }
interface JLPTN5AdjectiveNaInterface extends JLPTN5BaseInterface { }
interface JLPTN5KanjiInterface extends JLPTN5KanjiBaseInterface { }
interface JLPTN5GrammarInterface extends Pick<JLPTN5BaseInterface, "main" | "romaji" | "meaning"> { }
interface JLPTN5VerbInterface extends JLPTN5BaseInterface { }

interface JLPTN4BaseInterface extends Pick<JLPTBaseInterface, "main" | "kana" | "meaning"> { }
interface JLPTN4KanjiBaseInterface extends KanjiBaseInterface { }

interface JLPTN4NounInterface extends JLPTN4BaseInterface { }
interface JLPTN4ParticlesInterface extends Pick<JLPTN4BaseInterface, "main" | "meaning"> { }
interface JLPTN4KatakanaNounInterface extends Pick<JLPTN4BaseInterface, "main" | "meaning"> { }
interface JLPTN4AdverbInterface extends JLPTN4BaseInterface { }
interface JLPTN4AdjectiveIInterface extends JLPTN4BaseInterface { }
interface JLPTN4AdjectiveNaInterface extends JLPTN4BaseInterface { }
interface JLPTN4KanjiInterface extends JLPTN4KanjiBaseInterface { }
interface JLPTN4GrammarInterface extends Pick<JLPTN4BaseInterface, "main" | "meaning"> { }
interface JLPTN4VerbInterface extends JLPTN4BaseInterface { }