
type Tuple<L extends number, T, S extends Array<T> = []> = 
    S['length'] extends L ? S : Tuple<L, T, [T, ...S]>;
type TupleReplace<A extends Array<any>, C, F> = 
    {
        [K in keyof A]: A[K] extends C ? F : A[K]
    };
type IntSequence<L extends number, R extends Array<number> = []> = 
    R['length'] extends L ? R : IntSequence<L, [...R, R['length']]>;

type Bool = True | False;
type True = "true";
type False = "false";


type Length<A extends Array<any> | ReadonlyArray<any>> = A['length'];


type Equals<T, U> = 
    [T] extends [U] ? [U] extends [T] ? True : False : False;

type Repeat<S extends string, N extends number, _I extends Array<never> = [], _R extends string = ``> = 
    Equals<Length<_I>, N> extends True ? _R : Repeat<S, N, [..._I, never], `${_R}${S}`>;


type ReplaceAll<S extends string, C extends string, R extends string> = 
    S extends '' ? S : S extends `${C}${infer Back}` ? `${R}${ReplaceAll<Back, C, R>}` : S extends `${infer Front}${infer Back}` ? `${Front}${ReplaceAll<Back, C, R>}` : never;



type ArrayType<A extends Array<any>> = A extends Array<infer T> ? T : never;

type ReplacerOptions<S extends string, O = {}> = 
    S extends '' 
     ? O 
     : S extends `{${infer C}}${infer Back}` 
      ? ReplacerOptions<Back, O & Record<C, string>> 
      : S extends `${infer F}${infer B}` 
       ? ReplacerOptions<B, O> 
       : never;


        
// 주어진 문자열의 i 번째 문자열을 r로 치환하여 반환한다.
type ReplaceIndex<S extends string, I extends number, R extends string, _C extends Array<never> = []> = 
    S extends ''
        ? S
        : Equals<Length<_C>, I> extends True 
            ? S extends `${infer Front}${infer Back}` 
                ? `${R}${Back}` 
                : never 
            : S extends `${infer Front}${infer Back}` 
                ? `${Front}${ReplaceIndex<Back, I, R, [..._C, never]>}` 
                : never;

// T 타입의 K 키의 값을 V로 치환한다. key들의 순서도 보존된다.
type Modify<T, K extends keyof T, V> = {
    [_K in keyof T]: _K extends K ? V : T[_K]
};

// T 튜플을 유니온으로 바꾼다.
type AsUnion<T> = 
    T extends ReadonlyArray<infer T> ? T : never;

// T 객체를 유니온으로 바꾼다.
type DicAsUnion<T> = T[keyof T] extends infer P ? P : never;

// T 튜플을 뒤집는다.
type Reversed<T> = T extends [infer F, ...infer B] ? [...Reversed<B>, F] : [];


type Expand<T> = {
    [K in keyof T]: T[K]
};

// 문자열 S를 C를 기준으로 나누어 튜플로 반환한다.
type Split<S extends string, C extends string, _R extends Array<string> = []> = 
    S extends '' 
        ? _R 
        : S extends `${infer F}${C}${infer B}` 
            ? Split<B, C, [..._R, F]> 
            : S extends `${infer F}` ? Split<'', C, [..._R, F]> 
        : S extends `${infer F}${infer B}` 
        ? Split<B, C, [..._R]> : never;

type Join<T extends unknown[], U extends string | number> = T extends [
            infer First,
            ...infer Rest
          ]
            ? `${First & string}${Rest["length"] extends 0 ? "" : U}${Join<Rest, U>}`
            : "";


type Pop<A extends ReadonlyArray<any>> = 
    A extends [...infer F, infer B] ? F : never;
        
type First<A extends ReadonlyArray<any>> = 
    Equals<Length<A>, 1> extends True ? A extends [...infer T] ? T : never : First<Pop<A>>;


type Canvas<
    S extends {width: number, height: number}, 
    _A extends Array<number> = Reversed<IntSequence<S['height']>>, 
    _C extends Array<never> = [], 
    _R extends Record<number, string> = {}
> = 
    Equals<Length<_C>, Length<_A>> extends True 
        ? _R 
        : Canvas<
            S, 
            _A, 
            [..._C, never], 
            Expand<
                _R & Record<_A[Length<_C>], 
                Repeat<" ", S['width']>>
            >
        >;
type TypeCanvas<
    S extends {width: number, height: number}, 
    A extends Array<[number, number]>, 
    _C extends Array<never> = [], 
    _M extends Record<number, string> = Canvas<S>, 
    _X extends number = A[Length<_C>][0], 
    _Y extends number = A[Length<_C>][1]
> =
    Equals<Length<_C>, Length<A>> extends True 
        ? _M 
        : TypeCanvas<
            S,
            A, 
            [..._C, never],
            Modify<_M, _Y, ReplaceIndex<_M[_Y], _X, "▒">>
        >;
type Entity<D extends {x: number, y: number, texture: string}> = 
    {x: D['x'], y: D['y'], s: D['texture']};
// 사용자 지정 텍스쳐를 지닌 Entity<Data> 렌더링 가능
type TypeCanvas2<
        S extends {width: number, height: number}, 
        A extends Array<Entity<any>>, 
        _C extends Array<never> = [], 
        _M extends Record<number, string> = Canvas<S>, 
        _X extends number = A[Length<_C>]['x'], 
        _Y extends number = A[Length<_C>]['y']
    > =
        Equals<Length<_C>, Length<A>> extends True 
            ? _M 
            : TypeCanvas2<
                S,
                A, 
                [..._C, never],
                Modify<_M, _Y, ReplaceIndex<_M[_Y], _X, A[Length<_C>]['s']>>
            >;
    

type NoEmptyFieldShape<O extends Record<number | string | symbol, any>> = {
    [K in keyof O]: ReplaceAll<O[K], " ", "">;
};



type Matrix = Rotate90deg4x4<{
    3: "▒ 2 ▒ ▒",
    2: "▒ 2 ▒ ▒",
    1: "▒ ▒ ▒ 16",
    0: "4 ▒ ▒ ▒",
}>;

type Trnasposed = Reverse4x4<Matrix>;
/**
 *  3: "▒ 2 ▒ ▒",
 *  2: "▒ 2 ▒ ▒",
 *  1: "▒ ▒ ▒ 16",
 *  0: "4 ▒ ▒ ▒",
 * 
 * 를
 * 
 * 
 *  3: "4 ▒ ▒ ▒",
 *  2: "▒ ▒ 2 2",
 *  1: "▒ ▒ ▒ ▒",
 *  0: "▒ 16 ▒ ▒",
 * 
 * 으로 바꾼다.
 */


/**
 * 0의 0 ~ 3의 0
 * ...
 * 0의 3 ~ 3의 3
 * 
 * Data = [4 - - -, - - - 16, - 2 - -, - 2 - -]
 * 
 * 최적화를 위해
 * 참고: Pseudo Transpose라 역함수가 없어서 UnTranspose4x4 써야됨
 * 사실 Transpose라기보단 Pi/2 rad rotation matrix 하드코딩에 가깝다. 한번 더 수행하면 Pi rad 돌린 결과가 됨
 */
type Rotate90deg4x4<O extends Record<number, string>, Data extends Array<string> = Split<`${O[0]} ${O[1]} ${O[2]} ${O[3]}`, " ">> = 
    {
        3: `${Data[0]} ${Data[4]} ${Data[8]} ${Data[12]}`,
        2: `${Data[1]} ${Data[5]} ${Data[9]} ${Data[13]}`,
        1: `${Data[2]} ${Data[6]} ${Data[10]} ${Data[14]}`
        0: `${Data[3]} ${Data[7]} ${Data[11]} ${Data[15]}`
    };

/**
 * [a a a a, b b b b, c c c c, d d d d]
 */
type Reverse4x4<O extends Record<number, string>, Data extends Array<string> = Split<`${O[0]} ${O[1]} ${O[2]} ${O[3]}`, " ">> = 
    {
        3: `${Data[15]} ${Data[14]} ${Data[13]} ${Data[12]}`,
        2: `${Data[11]} ${Data[10]} ${Data[9]} ${Data[8]}`,
        1: `${Data[7]} ${Data[6]} ${Data[5]} ${Data[4]}`
        0: `${Data[3]} ${Data[2]} ${Data[1]} ${Data[0]}`
    };


/**
 * 0의 0 ~ 3의 0
 * ...
 * 0의 3 ~ 3의 3
 * 
 * Data = [- 2 - -, - 2 - -, - - - 16, 4 - - -]
 */
type RotateM90deg4x4<O extends Record<number, string>, Data extends Array<string> = Split<`${O[0]} ${O[1]} ${O[2]} ${O[3]}`, " ">> = 
    {
        3: `${Data[15]} ${Data[11]} ${Data[7]} ${Data[3]}`,
        2: `${Data[14]} ${Data[10]} ${Data[6]} ${Data[2]}`,
        1: `${Data[13]} ${Data[9]} ${Data[5]} ${Data[1]}`
        0: `${Data[12]} ${Data[8]} ${Data[4]} ${Data[0]}`
    };


// 문자열 S에 C가 몇번 나오는지 알려준다.
type CountMatches<S extends string, C extends string, _R extends Array<never> = []> = 
    S extends `` ? Length<_R> : 
        S extends `${C}${infer B}` ? 
            CountMatches<B, C, [..._R, never]>
        : S extends `${infer F}${infer B}` ? 
            CountMatches<B, C, _R>
        : never;

type Point<X extends number, Y extends number> = [X, Y];


type PushRight<T extends Array<any>, Fill extends string> = [Fill, ...Pop<T>];

type MergeData = {
    "-": "null",
    " ": "null",
    "2": "4",
    "4":  "8",
    "8": "16",
    "16": "32"
};
/**
 * Push 하기 전에 미리 합침 가능한걸 합쳐서 미는 판정을 낸다.
 */
type PushMerge<S extends string, _R extends string = ``, _N extends string = `!`> = 
    S extends `` ? _R : 
        S extends `${infer F extends keyof MergeData}${infer B}` ?
            Equals<F, `-`> extends True ? PushMerge<B, `${_R}-`, F> : 
            Equals<F, ` `> extends True ? PushMerge<B, `${_R}`, _N> : 
            Equals<F, _N> extends True ? PushMerge<B, `-${Join<Pop<Split<_R, ``>>, ``>}${MergeData[F]}`, F> : PushMerge<B, `${_R}${F}`, F> : never;

// 한쪽으로 밀기
type FullPushRight<S extends string, Fill extends string, Cutted extends string = ReplaceAll<S, Fill, "">> = 
    `${Join<Tuple<CountMatches<S, Fill>, Fill>, ` `>}${Equals<Cutted, ``> extends True ? `` : ` `}${Join<Split<Cutted, ``>, ` `>}`;

type RRR = PushMerge<`- 8 8 -`>;
type R5 = FullPushRight<RRR, "-">;

type InputKeys = "w" | "a "| "s" | "d";
type Game2048<
    S extends string, 
    Input extends Array<any> = Split<S, "">, 
    I extends Array<never> = [], 
    Canvas extends Record<number, string> = {
        3: "2 4 - -",
        2: "- - 2 -",
        1: "- - 2 -",
        0: "- 2 - -",
    }, 
    Key extends InputKeys = Input[Length<I>], 
    RightCanvas extends Record<number, string> = Rotate90deg4x4<Canvas>, 
    LeftCanvas extends Record<number, string> = RotateM90deg4x4<Canvas>, 
    RvsCanvas extends Record<number, string> = Reverse4x4<Canvas>
> = 
    Equals<Length<I>, Length<Input>> extends True ? Canvas : 
        Equals<Key, "w"> extends True ? 
            Game2048<S, Input, [...I, never], RotateM90deg4x4<{
                3: FullPushRight<PushMerge<RightCanvas[3]>, "-">,
                2: FullPushRight<PushMerge<RightCanvas[2]>, "-">,
                1: FullPushRight<PushMerge<RightCanvas[1]>, "-">,
                0: FullPushRight<PushMerge<RightCanvas[0]>, "-">,
            }>> : 
        Equals<Key, "s"> extends True ? 
            Game2048<S, Input, [...I, never], Rotate90deg4x4<{
                3: FullPushRight<PushMerge<LeftCanvas[3]>, "-">,
                2: FullPushRight<PushMerge<LeftCanvas[2]>, "-">,
                1: FullPushRight<PushMerge<LeftCanvas[1]>, "-">,
                0: FullPushRight<PushMerge<LeftCanvas[0]>, "-">,
            }>> : 
        Equals<Key, "a"> extends True ? 
            Game2048<S, Input, [...I, never], Reverse4x4<{
                3: FullPushRight<PushMerge<RvsCanvas[3]>, "-">,
                2: FullPushRight<PushMerge<RvsCanvas[2]>, "-">,
                1: FullPushRight<PushMerge<RvsCanvas[1]>, "-">,
                0: FullPushRight<PushMerge<RvsCanvas[0]>, "-">,
            }>> :        
        Equals<Key, "d"> extends True ? 
            Game2048<S, Input, [...I, never], {
                3: FullPushRight<PushMerge<Canvas[3]>, "-">,
                2: FullPushRight<PushMerge<Canvas[2]>, "-">,
                1: FullPushRight<PushMerge<Canvas[1]>, "-">,
                0: FullPushRight<PushMerge<Canvas[0]>, "-">,
            }> : never;
            







type Game = Game2048<"ad">;
/**
 * 2048
 * - 조작
 *   w, a, s, d로 블럭을 한 방향으로 이동시킨다.
 * 
 */



