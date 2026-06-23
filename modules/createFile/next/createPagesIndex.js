
export default function createPagesIndex(prefix, allPrefix) {
    let s = ''
    s = s + (
        "import dynamic from 'next/dynamic'\n" +

        "const DynamicComponentWithNoSSR = dynamic(\n" +
        "() => import('@/modules/" + prefix + "/pages/list'),\n" +
        "{ ssr: false }\n" +
        ")\n" +
        "function\t" + allPrefix + "Index" + "() {\n" +
        "return (\n" +
        "<DynamicComponentWithNoSSR />\n" +
        " )\n" +
        " }\n" +

        "\n" + "export default " + allPrefix + "Index");
    return s;
}


