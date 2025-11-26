FROM golang:1.23 AS builder
WORKDIR /src

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy sources
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags='-s -w' -o /app/server ./cmd/main

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
