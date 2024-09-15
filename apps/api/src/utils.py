async def accumulate(stream):
    response = ""
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content is None:
            break
        else:
            response += content
    return response
