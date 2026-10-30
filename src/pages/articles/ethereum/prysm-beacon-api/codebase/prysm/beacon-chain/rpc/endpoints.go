// Prysm v7.3.1 commit 96d418cd의 구조를 보존한 학습용 핵심 발췌입니다.
{
	// HTTP method와 path pattern이 모두 맞아야 이 handler가 선택됩니다.
	template: "/eth/v1/beacon/states/{state_id}/root",
	name:     namespace + ".GetStateRoot",
	middleware: []middleware.Middleware{
		// 이 endpoint의 response media type은 JSON입니다.
		middleware.AcceptHeaderHandler([]string{api.JsonMediaType}),
		middleware.AcceptEncodingHeaderHandler(),
	},
	handler: server.GetStateRoot,
	methods: []string{http.MethodGet},
}

func (e *endpoint) handlerWithMiddleware() http.HandlerFunc {
	handler := http.Handler(e.handler)
	for _, m := range e.middleware {
		// 각 middleware가 실제 endpoint handler를 감쌉니다.
		handler = m(handler)
	}

	// Endpoint 이름별 요청 수와 처리 시간을 계측합니다.
	handler = promhttp.InstrumentHandlerDuration(
		httpRequestLatency.MustCurryWith(prometheus.Labels{"endpoint": e.name}),
		promhttp.InstrumentHandlerCounter(
			httpRequestCount.MustCurryWith(prometheus.Labels{"endpoint": e.name}),
			handler,
		),
	)

	return func(w http.ResponseWriter, r *http.Request) {
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		handler.ServeHTTP(rw, r)

		// 4xx·5xx는 endpoint·status text·method label로 별도 집계합니다.
		if rw.statusCode >= 400 {
			httpErrorCount.WithLabelValues(e.name, http.StatusText(rw.statusCode), r.Method).Inc()
		}
	}
}
