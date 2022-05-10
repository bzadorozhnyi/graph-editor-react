export default function customDeepCopy(inObject) {
    let outObject, key, value;

    if(typeof inObject !== "object" || inObject === null) {
        return inObject;
    }

    outObject = Array.isArray(inObject) ? [] : {};

    for(key in inObject) {
        value = inObject[key];
        outObject[key] = customDeepCopy(value);
    }

    return outObject;
}